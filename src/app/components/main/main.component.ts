import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import tippy from 'tippy.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isModalOpen = false;
  isAuditorioModal = false;
  isCancha1Modal = false;
  isCancha2Modal = false;
  isCancha3Modal = false;
  isComedorModal = false;
  selectedArea: string = '';
  userRole: string = '';

  reservasPrensa: any[] = [];
  reservasCancha1: any[] = [];
  reservasCancha2: any[] = [];
  reservasCancha3: any[] = [];
  reservasComedor: any[] = [];

  reservasDelDia: any[] = []; 

  calendarOptionsPrensa: any;
  calendarOptionsCancha1: any;
  calendarOptionsCancha2: any;
  calendarOptionsCancha3: any;
  calendarOptionsComedor: any;

  reserva: any = {
    nombreVisitante: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombreUsuario: '' 
  };
  formVisible = false;
  horasInicio: string[] = [];
  horasFin: string[] = [];
  selectedDate: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUserData()
      .then(userData => {
        this.userRole = userData.rol;
        this.reserva.nombreUsuario = userData.nombre;
        this.cargarReservas(); 
        this.generarHorasInicio(); 
      })
      .catch(error => console.error('Error al obtener los datos del usuario:', error));
  }

  showModal(area: string) {
    this.selectedArea = area;
    this.isModalOpen = true;

    this.isAuditorioModal = area === 'Auditorio';
    this.isCancha1Modal = area === 'Cancha 1';
    this.isCancha2Modal = area === 'Cancha 2';
    this.isCancha3Modal = area === 'Cancha 3';
    this.isComedorModal = area === 'Comedor';
  }

  closeModal() {
    this.isModalOpen = false;
    this.isAuditorioModal = false;
    this.isCancha1Modal = false;
    this.isCancha2Modal = false;
    this.isCancha3Modal = false;
    this.isComedorModal = false;
    this.formVisible = false; 
  }

  cargarReservas() {
    this.userService.obtenerReservasPrensa()
      .then(reservas => {
        this.reservasPrensa = reservas;
        this.initializeCalendar('Auditorio'); 
      });

    this.userService.obtenerReservasCancha1()
      .then(reservas => {
        this.reservasCancha1 = reservas;
        this.initializeCalendar('Cancha 1'); 
      });

    this.userService.obtenerReservasCancha2()
      .then(reservas => {
        this.reservasCancha2 = reservas;
        this.initializeCalendar('Cancha 2'); 
      });

    this.userService.obtenerReservasCancha3()
      .then(reservas => {
        this.reservasCancha3 = reservas;
        this.initializeCalendar('Cancha 3'); 
      });

    this.userService.obtenerReservasComedor()
      .then(reservas => {
        this.reservasComedor = reservas;
        this.initializeCalendar('Comedor');
      });
  }

  initializeCalendar(area: string) {
    let events = [];
    switch(area) {
      case 'Auditorio':
        events = this.reservasPrensa.map(reserva => ({
          title: reserva.nombreVisitante,
          start: `${reserva.fecha}T${reserva.horaInicio}`,
          end: `${reserva.fecha}T${reserva.horaFin}`,
          description: `${reserva.horaInicio} - ${reserva.horaFin}`
        }));
        this.calendarOptionsPrensa = this.createCalendarOptions(events);
        break;

      case 'Cancha 1':
        events = this.reservasCancha1.map(reserva => ({
          title: reserva.nombreVisitante,
          start: `${reserva.fecha}T${reserva.horaInicio}`,
          end: `${reserva.fecha}T${reserva.horaFin}`,
          description: `${reserva.horaInicio} - ${reserva.horaFin}`
        }));
        this.calendarOptionsCancha1 = this.createCalendarOptions(events);
        break;

      case 'Cancha 2':
        events = this.reservasCancha2.map(reserva => ({
          title: reserva.nombreVisitante,
          start: `${reserva.fecha}T${reserva.horaInicio}`,
          end: `${reserva.fecha}T${reserva.horaFin}`,
          description: `${reserva.horaInicio} - ${reserva.horaFin}`
        }));
        this.calendarOptionsCancha2 = this.createCalendarOptions(events);
        break;

      case 'Cancha 3':
        events = this.reservasCancha3.map(reserva => ({
          title: reserva.nombreVisitante,
          start: `${reserva.fecha}T${reserva.horaInicio}`,
          end: `${reserva.fecha}T${reserva.horaFin}`,
          description: `${reserva.horaInicio} - ${reserva.horaFin}`
        }));
        this.calendarOptionsCancha3 = this.createCalendarOptions(events);
        break;

      case 'Comedor':
        events = this.reservasComedor.map(reserva => ({
          title: reserva.nombreVisitante,
          start: `${reserva.fecha}T${reserva.horaInicio}`,
          end: `${reserva.fecha}T${reserva.horaFin}`,
          description: `${reserva.horaInicio} - ${reserva.horaFin}`
        }));
        this.calendarOptionsComedor = this.createCalendarOptions(events);
        break;
    }
  }

  createCalendarOptions(events: any[]) {
    return {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'America/Mexico_City',
      events: events,
      dateClick: this.onDateClick.bind(this),
      selectable: true,
      displayEventTime: false,
      eventDidMount: (info: any) => {
        tippy(info.el, {
          content: info.event.extendedProps.description,
          placement: 'top',
          arrow: true,
          theme: 'light',
        });
      }
    };
  }

  onDateClick(event: any) {
    let fechaSeleccionada = new Date(event.dateStr);
    let fechaActual = new Date();

    fechaSeleccionada = new Date(fechaSeleccionada.getTime() + fechaSeleccionada.getTimezoneOffset() * 60000);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
      alert('No puedes hacer reservas en fechas anteriores al día actual.');
      return;
    }

    this.reserva.fecha = event.dateStr;
    this.filtrarReservasDelDia(); 
    this.formVisible = true; 
  }

  filtrarReservasDelDia() {
    switch(this.selectedArea) {
      case 'Auditorio':
        this.reservasDelDia = this.reservasPrensa.filter(reserva => reserva.fecha === this.reserva.fecha);
        break;
      case 'Cancha 1':
        this.reservasDelDia = this.reservasCancha1.filter(reserva => reserva.fecha === this.reserva.fecha);
        break;
      case 'Cancha 2':
        this.reservasDelDia = this.reservasCancha2.filter(reserva => reserva.fecha === this.reserva.fecha);
        break;
      case 'Cancha 3':
        this.reservasDelDia = this.reservasCancha3.filter(reserva => reserva.fecha === this.reserva.fecha);
        break;
      case 'Comedor':
        this.reservasDelDia = this.reservasComedor.filter(reserva => reserva.fecha === this.reserva.fecha);
        break;
    }
  }

  reservar(area: string) {
    if (this.reservaValida()) {
      const timestamp = new Date().toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
  
      this.reserva.timestamp = timestamp;
  
      switch (area) {
        case 'Auditorio':
          this.userService.guardarReservaPrensa(this.reserva);
          break;
        case 'Cancha 1':
          this.userService.guardarReservaCancha1(this.reserva);
          break;
        case 'Cancha 2':
          this.userService.guardarReservaCancha2(this.reserva);
          break;
        case 'Cancha 3':
          this.userService.guardarReservaCancha3(this.reserva);
          break;
        case 'Comedor':
          this.userService.guardarReservaComedor(this.reserva);
          break;
      }
  
      alert('Reserva realizada con éxito');
      this.cargarReservas(); 
      this.formVisible = false;
      this.limpiarFormulario(); 
    } else {
      alert('Ya existe una reserva en ese horario.');
    }
  }
  

  reservaValida() {
    return this.reservasDelDia.every(reserva => {
      const inicioActual = this.convertirHora(this.reserva.horaInicio);
      const finActual = this.convertirHora(this.reserva.horaFin);
      const inicioReserva = this.convertirHora(reserva.horaInicio);
      const finReserva = this.convertirHora(reserva.horaFin);

      return (finActual <= inicioReserva) || (inicioActual >= finReserva);
    });
  }

  convertirHora(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  generarHorasInicio() {
    const horasDisponibles = [];
    for (let hora = 8; hora <= 20; hora++) {
      horasDisponibles.push(`${hora < 10 ? '0' : ''}${hora}:00`);
      horasDisponibles.push(`${hora < 10 ? '0' : ''}${hora}:30`);
    }
    this.horasInicio = horasDisponibles;
  }

  actualizarHorasFin() {
    const inicioSeleccionado = this.convertirHora(this.reserva.horaInicio);
    this.horasFin = this.horasInicio.filter(hora => this.convertirHora(hora) > inicioSeleccionado);
  }

  limpiarFormulario() {
    this.reserva = {
      nombreVisitante: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      nombreUsuario: this.reserva.nombreUsuario
    };
  }
}
