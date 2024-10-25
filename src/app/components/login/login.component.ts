import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: UntypedFormGroup;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formLogin = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formLogin.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const { email, password } = this.formLogin.value;

    this.userService.login({ email, password })
      .then(response => {
        const uid = response.user?.uid;
        return this.userService.getUserData(uid);
      })
      .then(userData => {
        console.log('Datos del usuario:', userData);

        this.router.navigate(['/main'], { 
          state: { 
            nombre: userData.nombre, 
            modulos: userData.modulos || [],
            area: userData.area || '',
            rol: userData.rol 
          } 
        });
      })
      .catch(error => console.error('Error al iniciar sesión:', error));
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        const uid = response.user?.uid;
        return this.userService.getUserData(uid);  
      })
      .then(userData => {
        console.log('Datos del usuario:', userData);

        this.router.navigate(['/main'], { 
          state: { 
            nombre: userData.nombre, 
            modulos: userData.modulos || [],
            area: userData.area || '',
            rol: userData.rol 
          } 
        });
      })
      .catch(error => console.error('Error al iniciar sesión con Google:', error));
  }
}
