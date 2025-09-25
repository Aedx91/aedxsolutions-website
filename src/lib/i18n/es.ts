export const es = {
  nav: { home: 'Inicio', products: 'Productos', customers: 'Clientes', contact: 'Contacto' },
  footer: { privacy: 'Privacidad', terms: 'Términos' },
  hero: {
    title: 'Software con IA para operaciones reales',
    subtitle: 'Soluciones modernas web, cloud y consultoría que escalan con tu ambición.',
    cta: 'Hablemos'
  },
  contact: { title: 'Contáctanos', intro: 'Cuéntanos tu proyecto y te responderemos pronto.' },
  products: { title: 'Productos', intro: 'Un vistazo a las plataformas y aceleradores que construimos.' },
  customers: { title: 'Nuestros Clientes', intro: 'Equipos que confían en nosotros para rendimiento, seguridad y velocidad.' },
  legal: {
    privacyTitle: 'Política de Privacidad',
    termsTitle: 'Términos y Condiciones',
    labels: { updated: 'Actualizado', version: 'Versión', onThisPage: 'EN ESTA PÁGINA' },
    privacy: {
      sections: [
        { id: 'data-we-collect', heading: 'Datos Que Recopilamos', body: 'Actualmente recopilamos datos operativos mínimos necesarios para responder solicitudes entrantes, mejorar la fiabilidad y cumplir acuerdos comerciales potenciales. Este contenido provisional se ampliará.' },
        { id: 'how-we-use', heading: 'Cómo Usamos la Información', body: 'El uso se limita a prestar servicios solicitados, analítica interna, monitoreo de seguridad y cumplimiento legal.' },
        { id: 'storage-retention', heading: 'Conservación', body: 'Los datos se conservan sólo el tiempo necesario para los fines declarados o requisitos contractuales / legales.' },
        { id: 'your-rights', heading: 'Tus Derechos', body: 'Acceso, rectificación, supresión, portabilidad y oposición se atenderán cuando se añada el texto completo de cumplimiento.' },
        { id: 'contact', heading: 'Contacto', body: 'Preguntas: <a href="/{lang}/contact" class="link underline">Contáctanos</a>.' }
      ]
    },
    terms: {
      sections: [
        { id: 'agreement', heading: 'Acuerdo', body: 'Estos términos provisionales describen un marco de futura relación comercial. Serán reemplazados por lenguaje legal bilingüe final.' },
        { id: 'license', heading: 'Licencia & Acceso', body: 'El acceso se proporciona tal cual. No se ofrecen garantías en este documento provisional.' },
        { id: 'acceptable-use', heading: 'Uso Aceptable', body: 'Los usuarios no deben interferir con la seguridad, integridad o disponibilidad de la plataforma.' },
        { id: 'liability', heading: 'Limitación de Responsabilidad', body: 'En la máxima medida permitida por ley la responsabilidad se limitará a tasas incurridas directamente.' },
        { id: 'changes', heading: 'Cambios', body: 'Podemos actualizar estos términos; los cambios materiales serán versionados y fechados.' },
        { id: 'governing-law', heading: 'Ley Aplicable', body: 'Jurisdicción a especificar en el documento final.' },
        { id: 'contact', heading: 'Contacto', body: 'Para consultas contractuales o de cumplimiento por favor <a href="/{lang}/contact" class="link underline">escríbenos</a>.' }
      ]
    }
  },
  heroBadge: 'AedxSolutions • IA + Web + Integraciones',
  features: {
    sectionTitle: 'Pilares de Plataforma',
    sectionSubtitle: 'Capacidades fundamentales que aceleran entrega, fiabilidad e insight.',
    items: [
      { title: 'Función 1', desc: 'Propuesta de valor concisa destacando el beneficio medible número 1.' },
      { title: 'Función 2', desc: 'Propuesta de valor concisa destacando el beneficio medible número 2.' },
      { title: 'Función 3', desc: 'Propuesta de valor concisa destacando el beneficio medible número 3.' }
    ]
  }
};

export type EsDictionary = typeof es;
