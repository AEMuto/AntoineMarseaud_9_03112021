import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    buttonNewBill?.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    iconEye?.forEach(icon => {
      icon.addEventListener('click', this.handleClickIconEye)
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (e) => {
    const billUrl = e.currentTarget.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`)
    if (typeof $('#modaleFile').modal === 'function') $('#modaleFile').modal('show')
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  getBills = () => {
    const userEmail = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')).email : ""
    if (this.firestore) {
      return this.firestore
        .bills()
        .get()
        .then(snapshot => {
          const bills = snapshot.docs
            .map(doc => ({
              ...doc.data(),
              date: doc.data().date,
              trueDate: doc.data().date,
              status: formatStatus(doc.data().status)
            }))
            .filter(bill => bill.email === userEmail)
          return bills
        })
        .catch(error => error)
    }
  }
}