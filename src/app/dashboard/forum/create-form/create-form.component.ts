import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { ForumService } from '../forum.service';
import { User } from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {
  showFarmer = true;
  showBuyer = true;
  isHovering: boolean;
  images: File[] = [];

  @Input() postId: any; // get postID for update
  @Input() createOrUpdate: any;

  @Output() hideForm = new EventEmitter(); // hidden form when submit (emiiter)

  @ViewChild('item', { static: false }) form;
  @ViewChild('imageDrop', { static: false }) imageDrop;

  discussionForm = new FormGroup({
    title: new FormControl('', Validators.required),
    des: new FormControl('')
  });

  constructor(private forumService: ForumService) {}

  user: User = JSON.parse(localStorage.getItem('user'));
  formControls = this.discussionForm.controls;

  get title() {
    return this.discussionForm.get('title');
  }
  get des() {
    return this.discussionForm.get('des');
  }

  ngOnInit() {
    if (this.createOrUpdate === 'update') {
      // set form value for update
      this.forumService
        .getPostForUpdate(this.postId)
        .pipe()
        .subscribe(dataSet => {
          this.discussionForm.controls.title.setValue(dataSet.data().title);
          this.discussionForm.controls.des.setValue(dataSet.data().description);
          this.showBuyer = dataSet.data().showBuyer;
          this.showFarmer = dataSet.data().showFarmer;
        });
    }
  }

  onSelect(event) {
    // select images
    this.images.push(...event.addedFiles);
  }

  onRemove(event) {
    // remove selected images
    this.images.splice(this.images.indexOf(event), 1);
  }

  onCreate() {
    // create  post
    let id;
    const title = this.discussionForm.controls.title.value as string;
    const des = this.discussionForm.controls.des.value as string;
    const dateTime = new Date();
    const userId = this.user.uid;
    const userName = this.user.displayName;
    const userImage = this.user.photoURL;
    const showFarmer = this.showFarmer;
    const showBuyer = this.showBuyer;

    if (this.discussionForm.valid) {
      if (this.showFarmer === true || this.showBuyer === true) {
        if (this.createOrUpdate === 'create') {
          id = this.forumService.getPostId(); // get new ID for post
          this.forumService.createPost(
            // create new post
            id,
            title,
            des,
            dateTime,
            userId,
            userName,
            userImage,
            showFarmer,
            showBuyer,
            false
          );
        } else {
          id = this.postId;
          this.forumService.updatePost(
            // update selected post
            id,
            title,
            des,
            dateTime,
            userId,
            userName,
            userImage,
            showFarmer,
            showBuyer,
            false
          );
        }
        if (this.images != null) {
          // check and upload images
          this.forumService.uploadImg(this.images, 'post', id);
        }
        this.discussionForm.reset();
        this.hideForm.emit(false); // toggle form after submit
      } else {
        // else of check farmers and buyers
      }
    } else {
      // else of form validation check
    }
  }
}
