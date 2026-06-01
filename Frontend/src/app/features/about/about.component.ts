import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  hero = {
    title: 'Sobre EduTools',
    text: 'Potenciando el ecosistema educativo digital a través de la integración armónica entre pedagogía y diseño técnico.'
  };

  mision = {
    title: 'Nuestra Misión',
    icon: 'track_changes',
    text: 'Optimizar el flujo de trabajo entre los equipos pedagógicos y de maquetación, eliminando fricciones técnicas para permitir que el contenido educativo brille. Buscamos democratizar el acceso a herramientas de autoría institucional de alta calidad.'
  };

  vision = {
    title: 'Nuestra Visión',
    icon: 'visibility',
    text: 'Convertirnos en el estándar institucional para la creación de experiencias de aprendizaje, donde la estructura modular y la excelencia estética se unan para elevar los resultados académicos de cada estudiante.'
  };

  valores = [
    { icon: 'lightbulb', title: 'Innovación', text: 'Desarrollo constante de herramientas que anticipan las necesidades del docente moderno.' },
    { icon: 'accessibility', title: 'Accesibilidad', text: 'Compromiso con estándares universales para que el aprendizaje no tenga barreras.' },
    { icon: 'verified', title: 'Calidad', text: 'Excelencia técnica y pedagógica en cada componente de nuestra librería.' },
    { icon: 'groups', title: 'Colaboración', text: 'Fomentamos la sinergia entre diseñadores, técnicos y educadores.' }
  ];
}
