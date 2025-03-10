import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Adicionar RouterModule
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlanService } from '../plan.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule], // Adicionar RouterModule
    templateUrl: './login.component.html', // Mover o HTML para um arquivo separado (ver abaixo)
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        private planService: PlanService
    ) {}

    onSubmit() {
        this.http.post('http://localhost:8080/api/login', {
            email: this.email,
            password: this.password,
        }).subscribe({
            next: (response: any) => {
                localStorage.setItem('token', response.token);
                this.planService.updatePlanFromLogin(response.plan);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.errorMessage = err.error.message || 'Erro ao fazer login.';
            },
        });
    }
}