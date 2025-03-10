import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Plan {
    name: 'Pulse Starter' | 'Pulse Pro';
    endpointLimit: number;
    price: string;
    features: string[];
}

@Injectable({
    providedIn: 'root',
})
export class PlanService {
    private apiUrl = 'http://localhost:8080/api';
    private currentPlanSubject = new BehaviorSubject<Plan>({
        name: 'Pulse Starter',
        endpointLimit: 3,
        price: 'Grátis',
        features: ['Até 3 endpoints', 'Intervalos de 5 ou 10 minutos', 'Notificações via Telegram'],
    });
    currentPlan$ = this.currentPlanSubject.asObservable();

    constructor(private http: HttpClient) {}

    setPlan(planName: 'Pulse Starter' | 'Pulse Pro') {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Usuário não autenticado.');
            return;
        }

        this.http.post(`${this.apiUrl}/upgrade`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        }).subscribe({
            next: () => {
                const updatedPlan: Plan = planName === 'Pulse Starter'
                    ? {
                          name: 'Pulse Starter',
                          endpointLimit: 3,
                          price: 'Grátis',
                          features: ['Até 3 endpoints', 'Intervalos de 5 ou 10 minutos', 'Notificações via Telegram'],
                      }
                    : {
                          name: 'Pulse Pro',
                          endpointLimit: Infinity,
                          price: '$9,99/mês',
                          features: ['Endpoints ilimitados', 'Intervalos flexíveis (1, 5, 10 min)', 'Notificações via Telegram', 'Biblioteca pulseapilib (Java, Node.js, Python)'],
                      };
                this.currentPlanSubject.next(updatedPlan);
                console.log(`Plano alterado para: ${planName}`);
            },
            error: (err) => console.error('Erro ao atualizar plano:', err),
        });
    }

    getCurrentPlan(): Plan {
        return this.currentPlanSubject.getValue();
    }

    isEndpointLimitReached(endpointCount: number): boolean {
        const currentPlan = this.getCurrentPlan();
        return endpointCount >= currentPlan.endpointLimit;
    }

    updatePlanFromLogin(plan: 'Pulse Starter' | 'Pulse Pro') {
        const newPlan: Plan = plan === 'Pulse Starter'
            ? {
                  name: 'Pulse Starter',
                  endpointLimit: 3,
                  price: 'Grátis',
                  features: ['Até 3 endpoints', 'Intervalos de 5 ou 10 minutos', 'Notificações via Telegram'],
              }
            : {
                  name: 'Pulse Pro',
                  endpointLimit: Infinity,
                  price: '$9,99/mês',
                  features: ['Endpoints ilimitados', 'Intervalos flexíveis (1, 5, 10 min)', 'Notificações via Telegram', 'Biblioteca pulseapilib (Java, Node.js, Python)'],
              };
        this.currentPlanSubject.next(newPlan);
    }
}