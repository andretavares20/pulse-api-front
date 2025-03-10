import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanService, Plan } from '../plan.service';

@Component({
    selector: 'app-plans',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.css'],
})
export class PlansComponent {
    constructor(
        private router: Router,
        public planService: PlanService
    ) {}

    upgradeToPro() {
        this.planService.setPlan('Pulse Pro');
        this.router.navigate(['/dashboard']);
    }

    get currentPlan(): Plan {
        return this.planService.getCurrentPlan();
    }
}