import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
export declare class PaymentsService {
    private paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    findAll(): Promise<Payment[]>;
}
