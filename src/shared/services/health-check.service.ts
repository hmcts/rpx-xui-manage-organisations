import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

const healthCheckEndpointDictionary = {
    '/organisation': ['idamWeb', 'rdProfessionalApi']
};

@Injectable()
export class HealthCheckService {

    constructor(
        private http: HttpClient
    ) { }

    doHealthCheck(url): boolean {
        let result: boolean = true;
        const requests: Observable<object>[] = [];

        this.getEndpoints(url).forEach(element => {
            requests.push(this.http.get(element));
        });

        forkJoin(requests).subscribe(response => {
            console.log(response);
        }, err => {
            result = false;
        });

        return result;
    }

    getEndpoints(url): string[] {
        const endpoints: string[] = [];
        healthCheckEndpointDictionary[url].forEach(element => {
            endpoints.push(environment.services[element] + '/health');
        });
        return endpoints;
    }
}
