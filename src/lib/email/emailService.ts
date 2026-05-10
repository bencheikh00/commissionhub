export interface EmailData {
  to: string;
  subject: string;
  message: string;
  userName: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    console.log('📧 Email envoyé à:', data.to);
    console.log('📌 Sujet:', data.subject);
    console.log('💬 Message:', data.message);
    
    // TODO: Intégrer un vrai service d'email (EmailJS, SendGrid, etc.)
    
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

export async function sendAbsenceApprovedEmail(
  userEmail: string, 
  userName: string, 
  startDate: string, 
  endDate: string,
  adminEmail: string,
  adminName: string
) {
  return sendEmail({
    to: userEmail,
    userName,
    subject: '✅ Demande d\'absence approuvée - Commission Communication',
    message: `Bonjour ${userName},\n\nNous avons le plaisir de vous informer que votre demande d'absence du ${startDate} au ${endDate} a été approuvée par l'administration.\n\n✅ Statut : APPROUVÉE\n📅 Période : ${startDate} - ${endDate}\n\nVous pouvez désormais organiser votre absence en toute sérénité.\n\nPour toute question, n'hésitez pas à nous contacter :\n📧 ${adminEmail}\n\nCordialement,\n${adminName}\nCommission Communication IAM | Keur Bourama`
  });
}

export async function sendAbsenceRejectedEmail(
  userEmail: string, 
  userName: string, 
  startDate: string, 
  endDate: string,
  adminEmail: string,
  adminName: string
) {
  return sendEmail({
    to: userEmail,
    userName,
    subject: '❌ Demande d\'absence rejetée - Commission Communication',
    message: `Bonjour ${userName},\n\nNous sommes au regret de vous informer que votre demande d'absence du ${startDate} au ${endDate} a été rejetée par l'administration.\n\n❌ Statut : REJETÉE\n📅 Période demandée : ${startDate} - ${endDate}\n\nPour connaître les raisons de ce refus ou discuter d'une alternative, veuillez nous contacter :\n📧 ${adminEmail}\n\nNous restons à votre disposition pour trouver une solution.\n\nCordialement,\n${adminName}\nCommission Communication IAM | Keur Bourama`
  });
}

export async function sendAbsenceDeletedEmail(userEmail: string, userName: string) {
  return sendEmail({
    to: userEmail,
    userName,
    subject: '🗑️ Demande d\'absence supprimée',
    message: `Bonjour ${userName},\n\nVotre demande d'absence a été supprimée.\n\nCordialement,\nL'équipe CommissionHub`
  });
}
