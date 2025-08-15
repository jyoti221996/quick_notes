import { Component, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DbService } from '../../service_file/db.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ],
  templateUrl: './note.component.html'
})
export class NoteComponent {
  @HostBinding("class.flex_layout") appliedClass = true;
  public notesForm !: FormGroup;
  public isNewNote = false;
  notedData: any;
  inputValue: any


  constructor(private frmBuilder: FormBuilder, private database: DbService) { }
  ngOnInit() {
    this.getNotes();
    this.createForm();

  }
  notes: any[] = [];

  createForm() {
    this.notesForm = this.frmBuilder.group({
      id: new FormControl(0),
      noteTitle: new FormControl(''),
      noteContent: new FormControl(''),
      date: new FormControl(new Date())
    })
  }

  getNotes() {
    this.database.getQuickNotes().subscribe((data: any) => {
      this.notes = data.reverse();
    })
  }

  addNote() {
    this.isNewNote = true;
    this.isUpdate = false;
    this.notesForm.reset();
  }

  public isUpdate = false;
  saveNote() {
    if (this.isUpdate) {
      this.database.editQuickNotes(this.notesForm.value).subscribe((data: any) => {
        this.getNotes();
        this.selectedNotedData = data;
        this.isUpdate = true;
        this.isNewNote = false;
        this.notesForm.reset();
      });
    }
    else {
      this.notedData = {
        noteTitle: this.notesForm.value.noteTitle,
        noteContent: this.notesForm.value.noteContent,
        date: new Date()
      };
      this.database.addQuickNotes(this.notedData).subscribe((data: any) => {
        this.getNotes();
        this.selectedNotedData = data;
        this.isUpdate = true;
        this.isNewNote = false;
        this.notesForm.reset();
      })
    }
  }



  selectedNotedData: any;
  selectNote(note: any) {
    this.isNewNote = false;
    this.selectedNotedData = note;
  }

  editNote() {
    this.isNewNote = true;
    this.isUpdate = true;
    this.notesForm.patchValue({
      id: this.selectedNotedData.id,
      noteTitle: this.selectedNotedData.noteTitle,
      noteContent: this.selectedNotedData.noteContent,
      date: this.selectedNotedData.date
    });
  }

  deleteNote() {
    debugger
    this.database.deleteQuickNotes(this.selectedNotedData).subscribe(() => {
      debugger
      this.notes = this.notes.filter(n => n.id !== this.selectedNotedData.id);
      // this.getNotes();
      this.selectedNotedData = null;
      this.notesForm.reset();
      this.isNewNote = false;
      this.isUpdate = false;
      this.notesForm.reset();
    })
  }


  searchNoteList(data:any){
    if (data) {
      this.database.getQuickNotes().subscribe((notes: any) => {
        this.notes = notes.filter((note:any) => note.noteTitle.toLowerCase().includes(data.toLowerCase()) || note.noteContent.toLowerCase().includes(data.toLowerCase()));
      });
    } else {
      this.getNotes();
    }
  }

  public isDark = false;
  changeTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark');
  }
}
