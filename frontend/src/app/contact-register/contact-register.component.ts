import { Component, OnInit, TemplateRef, NgModule, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContactsService } from '../contacts/contacts.service'
import { Contact } from '../contacts/contact.model'
import { ActivatedRoute } from '@angular/router'
import { NotificationService } from '../shared/messages/notification.service'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
    selector: 'app-contact-register',
    templateUrl: './contact-register.component.html',
    animations : [
        trigger('contactRegisterAppeared', [
            state('ready', style({
                opacity: 1
            })),
            transition('void => ready', [
                style({
                    opacity: 0,
                    transform: 'translate( -40px)'
                }), animate('500ms 0s ease-in-out')
            ])
        ])
    ]
})

@Injectable()
export class ContactRegisterComponent implements OnInit {

    contactRegisterState = 'ready'
    contact : Contact = {
        id : null,
        name : '',
        phone_number: '',
        address : '',
        email : '',
        cell_number : ''
    }
    form: FormGroup
    loaded : boolean

    constructor(private formBuilder: FormBuilder,
                private contactsService : ContactsService,
                private router: ActivatedRoute,
                private notificationService: NotificationService) {}

        ngOnInit() {
            this.form = this.formBuilder.group({
                id: this.formBuilder.control(undefined),
                name: this.formBuilder.control(''),
                phone_number: this.formBuilder.control(''),
                address: this.formBuilder.control(''),
                email: this.formBuilder.control(''),
                cell_number: this.formBuilder.control('')
            })
            this.router.params.subscribe(res => this.contact.id = res.id)
            this.setContact()
        }

        onSubmit(){
            const body = this.contact
            if (this.loaded) {
                this.contactsService.alterContact(body).subscribe(contact => {
                    console.log(contact)
                    this.notificationService.notify(`Contact altered successfully!`)
                })
                this.loaded = false
            } else {
                this.contactsService.addContact(body).subscribe(contact => {
                    console.log(contact)
                    this.notificationService.notify(`Contact added successfully!`)
                })
            }
            this.clearFields()
        }

        setContact() {
            if (this.contact.id) {
                this.contactsService.getOne(this.contact.id).subscribe(res => {
                    if (res[0]){
                        this.contact = res[0]
                    } else {
                        this.contact = res
                    }
                    this.loaded = true
                })
            }
        }

        clearFields() {
            this.contact.id = undefined
            this.contact.name = ''
            this.contact.phone_number = ''
            this.contact.address = ''
            this.contact.email = ''
            this.contact.cell_number = ''
        }
    }
