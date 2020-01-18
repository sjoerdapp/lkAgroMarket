import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { DemandAd } from 'src/app/shared/models/demand-ad';
import { forkJoin, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DemandAdService {
  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore
  ) {}

  buyerAdform = new FormGroup({
    id: new FormControl(null),
    foodtype: new FormControl('', Validators.required),
    food: new FormControl('', Validators.required),
    expectedamount: new FormControl('1Kg', Validators.required),
    priceperunit: new FormControl('50', Validators.required),
    description: new FormControl('', Validators.required),
    organic: new FormControl('', Validators.required),
    deadline: new FormControl(
      new Date().toISOString().split('T')[0],
      Validators.required
    )
  });

  getdemandAdid() {
    return this.afs.createId();
  }
  createBuyerad(demandAd: DemandAd) {
    const demandAdCollection: AngularFirestoreCollection<DemandAd> = this.afs.collection(
      'demandAd'
    );
    return from(demandAdCollection.doc(demandAd.id).set(demandAd));
  }
  getdemandAds(userID: string): Observable<DemandAd[]> {
    return this.afs
      .collection('demandAd', ref => ref.where('owner', '==', userID))
      .valueChanges()
      .pipe(map(res => res as DemandAd[]));
  }

  getdemandad(adId): Observable<DemandAd> {
    return this.afs
      .collection('demandAd')
      .doc<DemandAd>(adId)
      .valueChanges();
  }

  editAd(property) {
    this.buyerAdform.setValue({
      id: property.id,
      foodtype: property.foodtype,
      food: property.food,
      expectedamount: property.expectedamount,
      priceperunit: property.priceperunit,
      description: property.description,
      organic: property.organic,
      deadline: property.deadline
    });
  }

  defaultAd() {
    this.buyerAdform.setValue({
      id: null,
      foodtype: '',
      food: '',
      expectedamount: '50Kg',
      priceperunit: 50,
      description: '',
      organic: '',
      deadline: ''
    });
  }
}
