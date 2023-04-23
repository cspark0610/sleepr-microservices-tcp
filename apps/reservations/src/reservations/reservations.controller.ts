import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  CurrentUser,
  JwtAuthGuard as JwtAuthGuardCanActivate,
  UserDto,
} from '@app/common';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuardCanActivate)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() currentUser: UserDto,
  ) {
    const user = await this.reservationsService.create(
      createReservationDto,
      currentUser._id,
    );

    //console.log(user);
    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuardCanActivate)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuardCanActivate)
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuardCanActivate)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuardCanActivate)
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
