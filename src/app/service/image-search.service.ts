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
  queries: {
    nextPage: [
      {
        title: string;
        count: number,
        startIndex: number,
      }
    ]
  };
}

export interface Image {
  id: string;
  link: string;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageSearchService {
   baseUrl = 'http://microservices.seliselocal.com/api/image-search/imagesearch/do/request';
  baseUrlLocalHost = 'http://localhost:8080/imagesearch/';
  constructor(private http: HttpClient) {
  }
  public getImages(request: UserRequest, token: string): Observable<Response> {
    return this.http.post<Response>(this.baseUrlLocalHost + 'do/request', request, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  callbackRequest(item: Image): void {
    this.http.post(this.baseUrlLocalHost + 'callback/' + item.id, null, {
      headers : {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(data => {
      console.log(data);
    });
  }
}
