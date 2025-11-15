import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalVisible = false;

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
}
