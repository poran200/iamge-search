import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Image, ImageSearchService} from './service/image-search.service';
import {HttpErrorResponse} from '@angular/common/http';

export interface UserRequest {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  office: string;
  education: string;
  geolocation: string;
  startIndex: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userRequest: UserRequest = {userId: null, email: null, education: null, firstName: null,
    geolocation: null, lastName: null, office: null, startIndex: 1};
  title = 'image-search';
  itemsWithProfAndAddress: Image[] = [];
  itemsWithProfAndEdu: Image[] = [];
  itemsRow: Image[] = [];
  token: string;
  nextPageStartIndex: number;
  constructor(private imageSearchService: ImageSearchService) {
  }

  onSearch(searchForm: NgForm): any  {
    console.log(searchForm.value);
    if ( localStorage.getItem('token') == null){
      localStorage.setItem('token', searchForm.value.token);
    }
    this.token = searchForm.value.token;
    if (1 <= this.userRequest.startIndex){
         this.userRequest.startIndex = 1;
    }
    this.getImages(this.userRequest, searchForm.value.token);

  }

  private getImages(userRequest: UserRequest, token: string): void {
    this.imageSearchService.getImages(userRequest, token).subscribe(response => {
        console.log(response);
        if (response.data.itemsWithProfAndAddress != null) {
          this.itemsWithProfAndAddress = response.data.itemsWithProfAndAddress;
        }
        if (response.data.itemsWithProfAndEdu != null) {
          this.itemsWithProfAndEdu = response.data.itemsWithProfAndEdu;
        }
        this.itemsRow = response.data.itemsRow;
        this.nextPageStartIndex = response.data.queries.nextPage[0].startIndex;
        console.log(this.itemsRow);
      }, (error: HttpErrorResponse) => {
        if (error.status === 401) {
          window.alert('UnAuthorized Provide a valid token');
          localStorage.clear();
        } else {
          console.error(error);
          window.alert(error.status + ' ' + error.message);
        }
      }
    );
  }

  isItemWithProfAndAddressLength(): boolean {
    return this.itemsWithProfAndAddress.length < 0 ;
  }
  isItemWithProfAndEduLength(): boolean {
    return  this.itemsWithProfAndEdu.length < 0;
  }
  isItemWithRowLength(): boolean{
    return  this.itemsRow.length < 0;
  }

  seeMoreResults(): void {
    this.userRequest.startIndex = this.nextPageStartIndex;
    this.getImages(this.userRequest, this.token);
  }

  itemSelected( item: Image): void {
    console.log('itemSelected', item);
    this.imageSearchService.callbackRequest(item);
  }

  selectedImage(item: Image): string {
   return (item.weight > 0) ? 'prev-selected' : '';
  }
}
