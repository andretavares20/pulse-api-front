import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlanService, Plan } from '../plan.service';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Endpoint {
  id?: number;
  userId?: number;
  name: string;
  url: string;
  status: 'Online' | 'Offline' | 'Unknown';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  endpoints: Endpoint[] = [];
  newEndpoint: { name: string; url: string } = { name: '', url: '' };
  errorMessage: string = '';
  private refreshSubscription: Subscription | undefined;

  constructor(public planService: PlanService, private http: HttpClient) {}

  ngOnInit() {
    this.loadEndpoints();
    this.refreshSubscription = interval(30 * 1000).subscribe(() => {
      this.loadEndpoints();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadEndpoints() {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      this.errorMessage = 'Usuário não autenticado.';
      return;
    }

    this.http
      .get<{ message: string; endpoints?: Endpoint[] }>('http://localhost:8080/api/endpoints', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response) => {
          if (response.endpoints) {
            this.endpoints = response.endpoints;
          } else {
            this.endpoints = [];
          }
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erro ao carregar endpoints.';
        },
      });
  }

  removeEndpoint(endpoint: Endpoint) {
    const token = localStorage.getItem('token');
    if (!token || !endpoint.id) return;

    this.http
      .delete<{ message: string }>(`http://localhost:8080/api/endpoints/${endpoint.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.endpoints = this.endpoints.filter((ep) => ep.id !== endpoint.id);
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erro ao remover endpoint.';
        },
      });
  }

  get currentPlan(): Plan {
    return this.planService.getCurrentPlan();
  }

  onSubmitForm() {
    if (!this.newEndpoint.name || !this.newEndpoint.url.match(/^https?:\/\/.+/)) {
      this.errorMessage = 'Formulário inválido.';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Usuário não autenticado.';
      return;
    }

    this.http
      .post<{ message: string; endpoint?: Endpoint }>('http://localhost:8080/api/endpoints', this.newEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response) => {
          if (response.endpoint) {
            this.endpoints.push(response.endpoint);
          }
          this.newEndpoint = { name: '', url: '' };
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erro ao adicionar endpoint.';
        },
      });
  }

  addEndpoint() {
    if (this.planService.isEndpointLimitReached(this.endpoints.length)) {
      this.errorMessage = 'Limite de endpoints atingido. Faça upgrade para adicionar mais.';
      return;
    }

    const defaultEndpoint = {
      name: `Endpoint ${this.endpoints.length + 1}`,
      url: `https://example.com/${this.endpoints.length + 1}`,
    };
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Usuário não autenticado.';
      return;
    }

    this.http
      .post<{ message: string; endpoint?: Endpoint }>('http://localhost:8080/api/endpoints', defaultEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response) => {
          if (response.endpoint) {
            this.endpoints.push(response.endpoint);
          }
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erro ao adicionar endpoint.';
        },
      });
  }
}