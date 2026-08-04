import {healthCheckRepository} from "../repositories/repository";

export class healthService {
    constructor(private healthCheckRepository: healthCheckRepository)   {}

    public getHealthStatus() {
         return this.healthCheckRepository.getstatus();
    }
}