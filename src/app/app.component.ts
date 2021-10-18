import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Image, ImageSearchService} from './service/image-search.service';
import {HttpErrorResponse} from '@angular/common/http';
export interface UserRequest {
  firstName: string;
  lastName: string;
  office: string;
  address: string;
  education: string;
  geolocation: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userRequest: UserRequest = {address: '', education: '', firstName: '', geolocation: '', lastName: '', office: ''};
  title = 'image-search';
  itemsWithProfAndAddress: Image[];
  itemsWithProfAndEdu: Image[];
  itemsRow: Image[];
  token: string;

  constructor(private imageSearchService: ImageSearchService) {
  }

  onSearch(searchForm: NgForm): any  {
    console.log(searchForm.value);
    this.imageSearchService.getImages(this.userRequest, searchForm.value.token).subscribe(response => {
        console.log(response);
        this.itemsWithProfAndAddress = response.data.itemsWithProfAndAddress;
        this.itemsWithProfAndEdu = response.data.itemsWithProfAndEdu;
        this.itemsRow = response.data.itemsRow;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        window.alert('UnAuthorized Provide a valid token');
      }else{
        window.alert(error.status);
      }
      }
    );

  }
  isItemWithProfAndAddressLength(): boolean {
    return this.itemsWithProfAndAddress.length < 0;
  }
  isItemWithProfAndEduLength(): boolean {
    return  this.itemsWithProfAndEdu.length < 0;
  }
  isItemWithRowLength(): boolean{
    return  this.itemsRow.length < 0;
  }
}
