# Reactive Dynamic Array Forms Demo

Let us create a dynamic form which dynamically creates address forms of which can take upto 5 addresses.

### setting up the project

To work with reactive forms we need to add `ReactiveFormsModule` in the imports array of the AppModule.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

After this we have to import the classes required to create reactive dynamic form in the FormComponent's ts file.

```ts
import { FormBuilder, FormGroup,FormControl, FormArray, Validators } from '@angular/forms';
```

lets create a form using form builder class in the typescript class of `FormComponent`

```ts
constructor(private fb: FormBuiler) {}

userForm = this.fb.group({
    name : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.required, Validators.email]),
    phone : new FormControl('',[Validators.required]),
    addresses : this.fb.array([])
}) 
```

In the above code we have created a FormBuilder object inside the constructor. By using the `group method` of FormBuiler we can create a FormGroup will groups all the FormControls. And we have used `array method` to create FormArray. We make use of `FormArray Class` to dynamically generate the form.

Lets create a method to access the array of addresses:

```ts
get addresses():FormArray{
    return <FormArray> this.loginForm.get('addresses');
}
```
The above method is a getter method that returns `addresses` as FormArray form the userForm FormGroup.By using a getter method to retrieve the `addresses` FormArray, you can access it from other parts of your code without having to repeat the same code to retrieve it each time. This makes your code more modular and easier to maintain.

Now let's create a method which returns a FormGroup:
```ts
createAddress():FormGroup{
  return this.fb.group({
      houseNo : new FormControl('',[Validators.required]),
      street: new FormControl('', [Validators.required]),
      city : new FormControl('', [Validators.required]),
      state : new FormControl('', [Validators.required]),
      country : new FormControl('', [Validators.required]),
  })
}
```

Now we want two methods to add address and remove address.

```ts
// Add New Address
addAddress():void{
  if(this.addresses.length < 5){
    this.addresses.push(createAddress());
  }
}

// Delete existing address
deleteAddress(i:number):void{
    this.addresses.removeAt(i);
}
```
The code `addAddress():void{ if(this.addresses.length < 5){ this.addresses.push(createAddress()); } }` is a method that adds a new address to the addresses FormArray in the loginForm FormGroup. The method first checks if the length of the addresses FormArray is less than 5 using the length property. If the length is less than 5, it calls the `createAddress()` method to create a new FormGroup for the address and then pushes it to the addresses FormArray using the push() method. By adding a new address to the addresses FormArray, the addAddress() method allows the user to dynamically add multiple addresses to the form. The method also limits the number of addresses to 5 by checking the length of the addresses FormArray.

### Building HTML Template

```html
<form [formGroup]="loginForm" (ngSubmit)="submit()">

  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Enter your name" formControlName="name">
  </div>

  <div class="form-group">
    <label for="phone">Phone</label>
    <input type="text" id="phone" placeholder="Enter your phone" formControlName="phone">
  </div>

  <div class="form-group">
    <label for="email">email</label>
    <input type="text" id="email" placeholder="Enter your email" formControlName="email">
  </div>
  <div formArrayName="addresses">
    <div *ngFor="let address of addresses.controls; let i= index" [formGroupName]="i">   
      <p>Address {{i+1}}</p>

      <div class="form-group">
        <label for="houseNo">House.no</label>
        <input type="text" placeholder="enter house number" formControlName="houseNo">
      </div>

      <div class="form-group">
        <label for="street">Street</label>
        <input type="text" placeholder="enter street" formControlName="street">
      </div>

      <div class="form-group">
        <label for="city">City</label>
        <input type="text" placeholder="enter city" formControlName="city">    
      </div>

      <div class="form-group">
        <label for="state">state</label>
        <input type="text" placeholder="enter state" formControlName="state">
      </div>

      <button type="button" (click)="deleteAddress(i)">Remove Address</button>
    </div>
  </div>
  <button type="button" (click)="addAddress()">Add Address</button>
  <input type="submit" value="Submit">
</form>
```
