const xlsx = require('exceljs')

class Book {
  constructor(template_filename=null) {
    this.book = new xlsx.Workbook()
    this.sweet_amount = 0
    this.attachment_amount = 0
    this.cells = {
      package: {
        name: 'C4',
        type: 'C5'
      },
      sweet: 8,
      attachment: 12,
      price: {
        row: 16,
        col: 'B'
      },
      weight: {
        row: 16,
        col: 'C'
      },
    }

    return (async () => {
      await this.loadTemplate(template_filename)
      return this
    })()
  }

  loadTemplate(filename) {
    if (filename == null) return
    return new Promise(async (res, rej) => {
      await this.book.xlsx.readFile(filename)
      res(this.book)
    })
  }

  getSheets() {
    return this.book.worksheets.map(sheet => sheet.name)
  }

  setSheet(name) {
    this.sheet = this.book.getWorksheet(name)
    return this.sheet
  }

  writePackage(name, type) {
    if (this.sheet == null) return
    this.sheet.getCell(this.cells.package.name).value = name
    this.sheet.getCell(this.cells.package.type).value = type
  }
  
  writeInfo(price, weight) {
    if (this.sheet == null) return
    const row_shift = this.sweet_amount + this.attachment_amount
    const price_cell = `${this.cells.price.col}${this.cells.price.row + row_shift}`
    const weight_cell = `${this.cells.weight.col}${this.cells.weight.row + row_shift}`
    this.sheet.getCell(price_cell).value = price + 'рублей'
    this.sheet.getCell(weight_cell).value = weight + 'грамм'
  }

  insertSweet(name, sire, weight) {
    if (this.sheet == null) return
    const row_id = ++this.sweet_amount + this.cells.sweet
    this.sheet.insertRow(row_id, [this.sweet_amount, name, sire, weight], 'o+')
  }

  async insertAttachment(name) {
    if (this.sheet == null) return
    const row_id = ++this.attachment_amount + this.sweet_amount + this.cells.attachment
    await this.sheet.insertRow(row_id, [this.attachment_amount, name], 'o+')
    this.sheet.mergeCells(`B${row_id}:D${row_id}`)
  }

  writeFile(filename) {
    return new Promise(async (res, rej) => {
      await this.book.xlsx.writeFile(filename)
      res(filename)
    })
  }
}

module.exports = Book