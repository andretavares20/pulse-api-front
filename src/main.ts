import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { LoginComponent } from './app/login/login.component';
import { PlansComponent } from './app/plans/plans.component';
import { SignupComponent } from './app/signup/signup.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter([
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'plans', component: PlansComponent },
            { path: 'signup', component: SignupComponent },
        ]),
        provideHttpClient(),
    ],
}).catch((err) => console.error(err));