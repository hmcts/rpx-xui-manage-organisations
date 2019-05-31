import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;

describe('UserService', () => {
  let httpClient: HttpClient;
  let userService: UserService;

  beforeEach(() => {

    httpClient = createSpyObj<HttpClient>('httpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClient },
      ]
    });

    userService = TestBed.get(UserService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

});
