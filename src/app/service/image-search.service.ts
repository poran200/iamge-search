import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserRequest} from '../app.component';
import {Observable} from 'rxjs';


export interface Response {
  data: Data;
}

export interface Data {
  userId: string;
  itemsWithProfAndAddress: Image[];
  itemsWithProfAndEdu: Image[];
  itemsRow: Image[];
}

export interface Image {
  id: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageSearchService {
   baseUrl = 'http://microservices.seliselocal.com/api/image-search/imagesearch/do/request';
   baseUrlLocalHost = 'http://localhost:8080/imagesearch/do/request';
  constructor(private http: HttpClient) {
  }
  public getImages(request: UserRequest, token: string): Observable<Response> {
    return this.http.post<Response>(this.baseUrl, request, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
  }

}
