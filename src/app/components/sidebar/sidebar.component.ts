import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  areas: any[] = [];
  isCollapsed: boolean = false;
  expandedAreas: Set<string> = new Set();
  userData: any = {};
  modulosAsignados: string[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const uid = this.userService.getCurrentUserUid();
    if (uid) {
      this.userService.getUserData(uid)
        .then((data) => {
          this.userData = data;
          this.modulosAsignados = data.modulos || [];
          return this.loadModulos();
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario:', error);
        });
    }
  }

  async loadModulos() {
    try {
      const data = await this.userService.getAreasYModulos();
      this.areas = Object.keys(data).map((nombre) => ({
        nombre,
        modulos: data[nombre].modulos,
        disabled:
          this.userData.rol === 'admin'
            ? this.userData.area !== nombre
            : !this.puedeAccederArea(nombre),
      }));
    } catch (error) {
      console.error('Error al cargar los módulos:', error);
    }
  }
  

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleArea(areaNombre: string) {
    if (this.expandedAreas.has(areaNombre)) {
      this.expandedAreas.delete(areaNombre);
    } else {
      this.expandedAreas.add(areaNombre);
    }
  }

  isAreaExpanded(areaNombre: string): boolean {
    return this.expandedAreas.has(areaNombre);
  }

  puedeAcceder(modulo: string): boolean {
    return (
      this.userData.rol === 'admin' || this.modulosAsignados.includes(modulo)
    );
  }

  puedeAccederArea(area: string): boolean {
    return (
      this.userData.rol === 'admin' || 
      this.userData.area === area || 
      this.modulosAsignados.some((modulo) => this.areas.find(a => a.nombre === area)?.modulos.includes(modulo))
    );
  }
  

  onModuloClick(modulo: string) {
    if (this.puedeAcceder(modulo)) {
      this.router.navigate([`/modulo/${modulo}`]);
    } else {
      alert('No tienes permisos para acceder a este módulo.');
    }
  }

  esAdmin(): boolean {
    return this.userData.rol === 'admin';
  }

  navegarARegistro() {
    if (this.esAdmin()) {
      this.router.navigate(['/admin-main']);
    } else {
      alert('Solo los administradores pueden acceder al registro.');
    }
  }

  getIconoArea(areaNombre: string): string {
    switch (areaNombre) {
      case 'Administracion':
        return 'bx bxs-building';
      case 'Comedor':
        return 'bx bxs-dish';
      case 'Deportivo':
        return 'fas fa-futbol';
      case 'Mercadotecnia':
        return 'bx bxs-megaphone';
      case 'Operaciones':
        return 'bx bxs-cog';
      case 'TI':
        return 'bx bxs-devices';
      default:
        return 'bx bx-folder';
    }
  }

  cerrarSesion() {
    this.userService.logout()
      .then(() => this.router.navigate(['/login']))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  }

  navegarAInicio() {
    this.router.navigate(['/main']); 
  }
  isUserMenuOpen: boolean = false;  

toggleUserMenu() {
  this.isUserMenuOpen = !this.isUserMenuOpen;
}

}
