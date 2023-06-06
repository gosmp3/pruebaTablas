import { Component, OnInit } from '@angular/core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { centros } from '../models/centros';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  currentYear!: number;
  etapa!: string;
  nombrepersonal!: string;
  seccionsindical!: number;
  centrotrabajo!: string;
  evaluador!: string;
  rfc!: string;
  periodo!: string;
  inicioperiodo!: string;
  finperiodo!: string;
  municipio: string = "Irapuato";
  funcion!: string;
  clavecentro!: string;
  telefonocentro!: number;
  dias: number = 365;

  sumaPuntaje: number = 0;
  desempeno!: number;
  multiPuntajeyDias!: number;
  antiguedad!: number;
  academico!: number;
  cursos!: number;
  tt!: number;
  resultt!: string;
  observaciones!: string;

  centros = [...centros];
  registros!: any[];
  puntajeComp: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Obtener la fecha actual del sistema
  fechaActual = new Date();
  // Obtener solo el dia, mes y año
  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth() + 1;
  anio = this.fechaActual.getFullYear();
  // Asignarlo a la variable fechaFormateada
  fechaFormateada = `${this.dia.toString().padStart(2, '0')}/${this.mes
    .toString()
    .padStart(2, '0')}/${this.anio}`;


  constructor() { this.currentYear = new Date().getFullYear();
                  this.periodo = "Enero-Diciembre " + (this.currentYear - 1)

                  // Recupera los datos del LocalStorage al inicializar el componente
                  const storedData = localStorage.getItem('registros');

                  // Si hay datos almacenados, conviértelos de nuevo a un objeto o matriz JSON
                  this.registros = storedData ? JSON.parse(storedData) : [];
                }

  ngOnInit(): void {

  }

  enviarDatos() {
    // Obtén los valores de los campos
  const nuevoRegistro = {
    nombre: this.nombrepersonal,
    puntaje: this.resultt
  };

  // Agrega el nuevo dato a la variable datos
  this.registros.push(nuevoRegistro);

  // Guarda los datos actualizados en el LocalStorage
  localStorage.setItem('registros', JSON.stringify(this.registros));
  console.log("DATO AGREGADO");

  // Limpia los campos del formulario
  this.nombrepersonal = '';
  this.resultt = '';
  }

  calcularSumaPuntajes(): void {
    this.sumaPuntaje = this.puntajeComp.reduce((a, b) => a + Number(b), 0);
    this.desempeno = this.sumaPuntaje / 365;
    this.multiPuntajeyDias = this.desempeno * this.dias;
  }

  sumarTodo(): void {
    this.tt = Number(this.multiPuntajeyDias) + Number(this.antiguedad) + Number(this.academico) + Number(this.cursos);
    this.resultt = this.tt.toFixed(2);
  }

  findKey(): void {
    this.centros.forEach(data => {
      if (data.centro_de_trabajo === this.centrotrabajo) {
        this.clavecentro = data.clave_de_centro;
      }
    })
  }

  async generatePDF(): Promise<void> {
    const existingPdfBytes = await fetch(
      '../../assets/formats/4factores.pdf'
    ).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Realiza las modificaciones en el documento pdfDoc, como agregar texto, imágenes, etc.

    const page1 = pdfDoc.getPage(0);
    const page2 = pdfDoc.getPage(1);

    // Obtener la fuente estándar Helvetica
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page1.drawText(`${this.currentYear}`, {
      x: 357,
      y: page1.getHeight() - 92,
      size: 5,
      font: helveticaFontBold,
      color: rgb(0, 0, 0),
    });

    page1.drawText(`${this.etapa}`, {
      x: 190,
      y: page1.getHeight() - 110,
      size: 5,
      font: helveticaFontBold,
      color: rgb(0, 0, 0),
    });

    page1.drawText(`${this.nombrepersonal}`, {
      x: 98,
      y: page1.getHeight() - 133,
      size: 7,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    if (this.centrotrabajo.length >= 60) {
      page1.drawText(`${this.centrotrabajo}`, {
        x: 327,
        y: page1.getHeight() - 132.5,
        size: 4.5,
        font: helveticaFont,
        color: rgb(0, 0, 0.5),
      });
    } else {
      page1.drawText(`${this.centrotrabajo}`, {
        x: 327,
        y: page1.getHeight() - 132.5,
        size: 6,
        font: helveticaFont,
        color: rgb(0, 0, 0.5),
      });
    }

    if (Number(this.seccionsindical) === 45) {
      // 45
      page1.drawText(`X`, {
        x: 113,
        y: page1.getHeight() - 150,
        size: 8,
        font: helveticaFontBold,
        color: rgb(0, 0, 0.5),
      });
    } else {
      // 13
      page1.drawText(`X`, {
        x: 187,
        y: page1.getHeight() - 150,
        size: 8,
        font: helveticaFontBold,
        color: rgb(0, 0, 0.5),
      });
    }

    page1.drawText(`${this.evaluador}`, {
      x: 306,
      y: page1.getHeight() - 150.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.rfc}`, {
      x: 96,
      y: page1.getHeight() - 168.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.periodo}`, {
      x: 292,
      y: page1.getHeight() - 168,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.municipio}`, {
      x: 64,
      y: page1.getHeight() - 185.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.fechaFormateada}`, {
      x: 260,
      y: page1.getHeight() - 185.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.funcion}`, {
      x: 60,
      y: page1.getHeight() - 201.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.telefonocentro}`, {
      x: 337,
      y: page1.getHeight() - 220.5,
      size: 6,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.clavecentro}`, {
      x: 115,
      y: page1.getHeight() - 221.5,
      size: 7,
      font: helveticaFont,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[0]}`, {
      x: 495,
      y: page1.getHeight() - 475,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[1]}`, {
      x: 495,
      y: page1.getHeight() - 491,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[2]}`, {
      x: 495,
      y: page1.getHeight() - 509,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[3]}`, {
      x: 495,
      y: page1.getHeight() - 528,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[4]}`, {
      x: 495,
      y: page1.getHeight() - 546,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[5]}`, {
      x: 495,
      y: page1.getHeight() - 561,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[6]}`, {
      x: 495,
      y: page1.getHeight() - 577,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[7]}`, {
      x: 495,
      y: page1.getHeight() - 593,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[8]}`, {
      x: 495,
      y: page1.getHeight() - 609,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.puntajeComp[9]}`, {
      x: 495,
      y: page1.getHeight() - 631,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    page1.drawText(`${this.sumaPuntaje}`, {
      x: 495,
      y: page1.getHeight() - 652,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page1.drawText(`${this.desempeno}`, {
      x: 350,
      y: page1.getHeight() - 673,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page1.drawText(`${this.dias}`, {
      x: 380,
      y: page1.getHeight() - 703,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page1.drawText(`${this.multiPuntajeyDias}`, {
      x: 350,
      y: page1.getHeight() - 735,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page2.drawText(`${this.antiguedad}`, {
      x: 267,
      y: page1.getHeight() - 394,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page2.drawText(`${this.academico}`, {
      x: 433,
      y: page1.getHeight() - 356,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page2.drawText(`${this.cursos}`, {
      x: 462,
      y: page1.getHeight() - 417,
      size: 7,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page2.drawText(`${this.resultt}`, {
      x: 329,
      y: page1.getHeight() - 448.5,
      size: 9,
      font: helveticaFontBold,
      color: rgb(1, 0, 0),
    });

    page2.drawText(`${this.observaciones}`, {
      x: 119,
      y: page1.getHeight() - 560.5,
      size: 7,
      font: helveticaFontBold,
      color: rgb(0, 0, 0.5),
    });

    const modifiedPdfBytes = await pdfDoc.save();

    // Descargar el archivo modificado
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FCAPS-3 ' + `${this.nombrepersonal}`;
    link.click();
  }

}
