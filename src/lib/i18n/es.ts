export const es = {
  nav: { home: 'Inicio', products: 'Productos', customers: 'Clientes', contact: 'Contacto' },
  footer: { privacy: 'Privacidad', terms: 'Términos' },
  demo: {
    loginTitle: 'Acceso Demo | AedxSolutions',
    loginDescription: 'Inicia sesión para acceder al panel de demo.',
    dashboardTitle: 'Panel Demo | AedxSolutions',
    dashboardDescription: 'Panel demo protegido para recorridos con clientes.',
    loginButton: 'Acceso Demo',
    login: {
      title: 'Iniciar sesión',
      username: 'Usuario',
      password: 'Contraseña',
      signIn: 'Entrar',
      invalidCreds: 'Usuario o contraseña inválidos.',
    },
    dashboard: {
      logout: 'Salir',
      walmartDemo: 'Demo Walmart',
      viewLogs: 'Ver Logs',
      toastSaved: 'Log guardado.',
      modalTitle: 'Demo Walmart',
      packedBoxesLabel: 'Cajas Empacadas / Packed Boxes',
      logEntry: 'Registrar',
      close: 'Cerrar',
      invalidNumber: 'Ingresa un entero válido (0 o mayor).',
    },
  },
  hero: {
    title: 'Un espacio para no olvidar lo que amas',
    subtitle: 'Guarda comidas, planes y momentos que no quieres perder—tu espacio para agendar citas de cine, cumpleaños y fechas importantes.',
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
  heroBadge: 'AedxSolutions • Construir • Integrar • Automatizar',
  features: {
    sectionTitle: 'Elige qué planear',
    sectionSubtitle: 'Voltea una carta para ver el plan y toca “Más info” para saber cómo lo ejecutamos.',
    items: [
      {
        title: 'Sesión de Descubrimiento',
        desc: 'Sesión corta y enfocada para mapear objetivos, restricciones y salir con una hoja de ruta clara.'
      },
      {
        title: 'Sprint de Integración',
        desc: 'Conectamos tus sistemas, lanzamos el primer flujo automatizado y dejamos todo documentado para un traspaso claro.'
      },
      {
        title: 'Sprint de IA Compañera',
        desc: 'Prototipamos un flujo asistido por IA con controles humanos y una guía de despliegue.'
      }
    ]
  }
};

export type EsDictionary = typeof es;
