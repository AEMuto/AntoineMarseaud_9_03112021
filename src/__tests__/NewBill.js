import { fireEvent, screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { bills } from '../fixtures/bills';
import { localStorageMock } from '../__mocks__/localStorage'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import Firestore from '../app/Firestore';
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import Router from '../app/Router'
import firebase from '../__mocks__/firebase';
import DashboardUI from '../views/DashboardUI';

jest.mock('../app/Firestore');

describe('Given I am connected as an employee', () => {
  // describe('When I am on NewBill Page', () => {
  //   test('Then mail icon in vertical layout should be highlighted', () => {
  //     Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });
  //     Object.defineProperty(window, 'localStorage', {
  //       value: localStorageMock,
  //     });
  //     window.localStorage.setItem(
  //       'user',
  //       JSON.stringify({
  //         type: 'Employee',
  //       })
  //     );
  //     const pathname = ROUTES_PATH['NewBill'];
  //     Object.defineProperty(window, 'location', { value: { hash: pathname } });
  //     document.body.innerHTML = `<div id="root"></div>`;
  //     Router();
  //     expect(
  //       screen.getByTestId('icon-mail').classList.contains('active-icon')
  //     ).toBe(true);
  //   })
  //})
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
  // describe('When I am on NewBill Page and enter a file', () => {
  //   test('Then it should resolve the file name', () => {
  //     const onNavigate = (pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname })
  //     }
  //
  //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //     window.localStorage.setItem('user', JSON.stringify({
  //       type: 'Employee'
  //     }))
  //
  //     const html = NewBillUI()
  //     document.body.innerHTML = html
  //
  //     const newBill = new NewBill({
  //       document, onNavigate, Firestore, localStorage: window.localStorage
  //     })
  //
  //     const handleChangeFile = jest.fn(newBill.handleChangeFile)
  //     const fileInput = screen.getByTestId('file')
  //     fileInput.addEventListener('change', handleChangeFile)
  //
  //     fireEvent.change(fileInput, {
  //       target: {
  //         files: [new File(['image.png'], 'image.png', { type: 'image/png' })],
  //       },
  //     });
  //
  //     expect(handleChangeFile).toHaveBeenCalled();
  //     expect(fileInput.files[0].name).toBe('image.png');
  //
  //   })
  // })
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
    test("add bill", async () => {
      const getSpy = jest.spyOn(firebase, "post")

    })
  })
})
