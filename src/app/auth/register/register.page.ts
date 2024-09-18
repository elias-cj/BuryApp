import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular'; // Importa AlertController
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController // Inyecta AlertController
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      termsAccepted: [false, Validators.requiredTrue] // Control para el checkbox
    });
  }

  async onRegister() {
    // Primero verifica si los términos y condiciones no han sido aceptados
    if (!this.registerForm.get('termsAccepted')?.value) {
      await this.presentAlert('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }

    // Luego verifica la validez del formulario completo
    if (this.registerForm.invalid) {
      await this.presentToast('Por favor, completa todos los campos correctamente', 'warning');
      return;
    }

    const { name, email, password } = this.registerForm.value;
    const usuario = new Usuario(0, name, email, password);

    try {
      const response = await this.authService.register(usuario).toPromise();
      this.router.navigate(['/login']);
      await this.presentToast('Registro exitoso', 'success');
    } catch (error) {
      await this.presentToast('Error en el registro, intenta de nuevo', 'danger');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}
