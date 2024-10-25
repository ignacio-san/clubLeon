import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formEmployee: UntypedFormGroup;
  area: string = '';  
  modulosDisponibles: string[] = [];  

  constructor(
    public userService: UserService,
    private router: Router
  ) {
    this.formEmployee = new UntypedFormGroup({
      nombre: new UntypedFormControl('', Validators.required),
      apellidos: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
      modulos: new UntypedFormControl([], Validators.required) 
    });
  }

  ngOnInit(): void {
    const uid = this.userService.getCurrentUserUid();  

    if (uid) {
      this.userService.getUserData(uid)
        .then(userData => {
          this.area = userData.area;  
          console.log('Área del admin:', this.area);
          return this.loadModulos(this.area);  
        })
        .catch(error => console.error('Error al obtener datos del usuario:', error));
    } else {
      console.error('No se encontró un usuario logueado.');
      this.router.navigate(['/login']); 
    }
  }

  // Cargar módulos desde bd
  loadModulos(area: string) {
    this.userService.getModulosPorArea(area)
      .then(modulos => {
        this.modulosDisponibles = modulos;
      })
      .catch(error => console.error('Error al obtener los módulos:', error));
  }

  // registrar empleado
  onRegisterEmployee() {
    if (this.formEmployee.invalid) {
      console.error('Formulario inválido.');
      return;
    }

    const { nombre, apellidos, email, password, modulos } = this.formEmployee.value;
    const fechaRegistro = new Date().toLocaleString();

    this.userService.register({ email, password })
      .then(response => {
        const uid = response.user?.uid;
        if (uid) {
          return this.userService.guardarDatosUsuario(uid, {
            nombre,
            apellidos,
            area: this.area,
            modulos,
            rol: 'empleado',
            fechaRegistro
          });
        } else {
          throw new Error('UID del usuario no disponible.');
        }
      })
      .then(() => console.log('Empleado registrado con éxito.'))
      .catch(error => console.error('Error al registrar empleado:', error));
  }
}
