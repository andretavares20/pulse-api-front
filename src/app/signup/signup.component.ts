import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Adicionar RouterModule
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './signup.component.html',
})
export class SignupComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(private http: HttpClient, private router: Router) {}

    onSubmit() {
        this.http.post('http://localhost:8080/api/signup', {
            email: this.email,
            password: this.password,
        }).subscribe({
            next: (response: any) => {
                console.log('Usuário registrado com sucesso', response);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.errorMessage = err.error.message || 'Erro ao registrar usuário.';
            },
        });
    }
}