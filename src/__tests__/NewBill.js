import { fireEvent, screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { bills } from '../fixtures/bills';
import { localStorageMock } from '../__mocks__/localStorage'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import Firestore from '../app/Firestore';
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import Router from '../app/Router'
import firebase from '../__mocks__/firebase';
import BillsUI from '../views/BillsUI';

jest.mock('../app/Firestore');

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then mail icon in vertical layout should be highlighted', () => {
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const pathname = ROUTES_PATH['NewBill'];
      Object.defineProperty(window, 'location', { value: { hash: pathname } });
      document.body.innerHTML = `<div id="root"></div>`;
      Router();
      expect(
        screen.getByTestId('icon-mail').classList.contains('active-icon')
      ).toBe(true);
    })
  })
  describe('When I am on NewBill Page and enter an incorrect file', () => {
    test('Then it should display an error', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)

      const fileInput = screen.getByTestId('file')

      fileInput.addEventListener('change', handleChangeFile)

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['image.webp'], 'image.webp', { type: 'image/webp' })],
        },
      });

      const error = screen.getAllByTestId('error')

      expect(handleChangeFile).toHaveBeenCalled()
      expect(error[0]).toBeVisible()
    })
  })
  describe('When I am on NewBill Page and click submit', () => {
    test('Then I should return on bill page', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })

      const handleSubmit = jest.fn(newBill.handleSubmit)
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)

      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByText('Mes notes de frais')).toBeVisible()
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as an Employee", () => {
  describe("When I create a new bill", () => {
    test("post bill from mock API POST", async () => {
      const postSpy = jest.spyOn(firebase, "post")
      const bill = {
        "id": "UIUZtnPQvnbFnB0ozvJh",
        "name": "test3",
        "email": "a@a",
        "type": "Services en ligne",
        "vat": "60",
        "pct": 20,
        "commentAdmin": "bon bah d'accord",
        "amount": 300,
        "status": "accepted",
        "date": "2003-03-03",
        "commentary": "",
        "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
      }
      const response = await firebase.post(bill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(response.data.length).toBe(1)
    })
    test("post bill from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("post bill from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
