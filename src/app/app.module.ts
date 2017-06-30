import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { EmptyRoomsService } from './empty-rooms.service';
import { CreateBookingService } from './create-booking.service';
import { RoomsService } from './rooms.service';
import { RoomServiceService } from './room-service.service';
import { BookingService } from './booking.service';
import { ExpenditureService } from './expenditure.service';
import { VehicleNumbersService } from './vehicle-numbers.service';
import { AppComponent } from './app.component';
import { CurrentRoomsComponent } from './current-rooms/current-rooms.component';
import { NewBookingComponent } from './new-booking/new-booking.component';
import { HttpModule , JsonpModule } from '@angular/http';
import { FloorFilterPipe } from './current-rooms/floorFilter.pipe';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { CreateRoomServiceComponent } from './create-room-service/create-room-service.component';
import { ReportService } from './report.service';
import { MomentModule } from 'angular2-moment';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { ReportComponent } from './report/report.component';
import { SidebarModule } from 'ng-sidebar';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { MyDatePickerModule } from 'mydatepicker';
import { VehicleNumbersComponent } from './vehicle-numbers/vehicle-numbers.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/current-rooms',
    pathMatch: 'full'
  },
  {
    path: 'new-booking',
    component: NewBookingComponent,
    pathMatch: 'full'
  },
  {
    path: 'current-rooms',
    component: CurrentRoomsComponent,
    pathMatch: 'full'
  },
  {
    path : 'room-service',
    component : CreateRoomServiceComponent,
    pathMatch : 'full'
  },
  {
    path : 'booking/:id',
    component: BookingDetailComponent
  },
  {
    path : 'expenditure',
    component : ExpenditureComponent
  },
  {
    path : 'reports',
    component : ReportComponent,
    children : [
      {
        path : '',
        redirectTo : 'balance-sheet',
        pathMatch : 'full'
      },
      {
        path : 'balance-sheet',
        component : BalanceSheetComponent
      },
      {
        path : 'vehicle-numbers',
        component : VehicleNumbersComponent
      }
    ]
  }

]


@NgModule({
  declarations: [
    AppComponent,
    CurrentRoomsComponent,
    NewBookingComponent,
    FloorFilterPipe,
    BookingDetailComponent,
    CreateRoomServiceComponent,
    ExpenditureComponent,
    ReportComponent,
    BalanceSheetComponent,
    VehicleNumbersComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    SelectModule,
    HttpModule,
    JsonpModule,
    MomentModule,
    MyDatePickerModule,
    SidebarModule.forRoot()
  ],
  providers: [
    EmptyRoomsService,
    CreateBookingService,
    RoomsService,
    BookingService,
    RoomServiceService,
    ExpenditureService,
    ReportService,
    VehicleNumbersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
