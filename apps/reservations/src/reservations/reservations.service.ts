import { PAYMENTS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    // esto devuelve un observable al cual subscribimos con el pipe()
    return this.paymentsService
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map((stripeResponse) => {
          console.log(stripeResponse, 'stripeResponse');
          return this.reservationsRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            invoiceId: stripeResponse.id,
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.findAll({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
