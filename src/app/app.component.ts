import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Adicionar aqui

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        HttpClientModule, // Adicionar HttpClientModule
    ],
    template: `
        <router-outlet></router-outlet>
    `,
})
export class AppComponent {}