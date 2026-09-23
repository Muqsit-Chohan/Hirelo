import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Navbar from '../../components/common/navbar/Navbar'
import Footer from '../../components/common/Footer/Footer'
import './legal.css'

const policies = {
  terms: {
    title: 'Terms of Service', summary: 'A shared understanding for a better hiring experience.', Icon: FileText,
    sections: [
      ['Using Hirelo', 'Hirelo helps job seekers discover roles and submit applications, and helps companies publish openings and review candidates. These terms describe the rules for using those features. If you do not agree with these terms, do not use the service.'],
      ['Your account', 'Provide accurate account and profile information and keep your login credentials private. You are responsible for the information and activity submitted through your account. Only represent a company if you are authorized to act for it. Contact us if you believe someone has accessed your account without permission.'],
      ['Job listings and applications', 'Employers are responsible for the accuracy, legality and availability of their job listings and for their hiring decisions. Applicants are responsible for the accuracy of their applications and resumes. Do not post misleading opportunities, impersonate another person, or request payments or sensitive financial credentials through a job listing.'],
      ['Content you share', 'Only upload content you own or have permission to share. You allow Hirelo to store, display and share your submitted content as needed to operate the features you use, including showing applications to employers. Do not upload unlawful, abusive, discriminatory or malicious content.'],
      ['Acceptable use', 'Do not interfere with the service, attempt unauthorized access, distribute malware, scrape private candidate information, or use other people’s information for unrelated marketing. Employers should use candidate information only for legitimate recruitment purposes and handle it responsibly.'],
      ['Hiring outcomes and external services', 'A listing or application does not guarantee an interview, an offer or employment. Hirelo is not a party to employment agreements between candidates and employers. Review an employer and any external website before sharing additional information; external services have their own terms and privacy practices.'],
      ['Availability and account access', 'Features may change or be temporarily unavailable. Access may be restricted when an account is used to abuse the service or violate these terms. You can stop using Hirelo at any time and contact us with account-related requests. These terms do not remove rights or protections that cannot be excluded under applicable law.'],
      ['Updates and questions', 'Changes to these terms will be reflected on this page. Review the current terms when using the service. For questions about these terms or to report misuse, use the contact page.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy', summary: 'Understand the information you share and how the platform uses it.', Icon: ShieldCheck,
    sections: [
      ['Information you provide', 'Account information includes your name, email address, phone number, account role, location, and the details you enter about yourself or your company. Profiles can include a photo, professional experience, skills, education and a resume. Job listings and applications include the content you submit and application status updates.'],
      ['How information is used', 'Hirelo uses account information to authenticate users, provide profiles, publish job listings, deliver applications to employers and display application progress. Email is used for account verification. Information submitted through the contact page is used to handle your enquiry.'],
      ['Who can see your information', 'Company profiles and published jobs can be viewed publicly. Signed-in company accounts can access candidate profiles, including contact information and resumes. When you apply for a role, the employer can review your application and attached resume. Share only information that you are comfortable providing for recruitment.'],
      ['Storage and service providers', 'The application uses Supabase for database and file storage, and an email service for account messages. Profile photos are served from public storage; newly uploaded resumes use private storage with temporary download links. An employer who downloads a resume may retain a separate copy, which is outside the platform’s direct control.'],
      ['Cookies and browser storage', 'Authentication uses a session token supplied through a cookie or browser local storage. This enables signed-in features and authenticated requests. You can clear cookies and local storage in your browser; doing so may sign you out or prevent account features from working until you sign in again.'],
      ['Security and retention', 'Passwords are stored as hashes, and authenticated features use access controls. No online service can guarantee absolute security. Account, profile and application records are stored to support the service; this notice does not specify an automatic deletion period. Contact us to ask about retention or request removal of your information.'],
      ['Your choices and requests', 'You can review and update supported profile fields from your account. For questions about access, correction, account closure or deletion, contact us and describe your request without sending your password. Verification may be needed before a request can be handled. Employers may need to be contacted separately about information they have downloaded. Any additional rights depend on the laws that apply to you.'],
      ['External links and policy updates', 'Links to employer websites and other external services are governed by their own privacy practices. This notice may be updated as the service changes. For questions about your information, use the contact page.'],
    ],
  },
}

export default function LegalPage({ type }) {
  const { title, summary, Icon, sections } = policies[type]
  return <div className="legal-page"><Navbar /><main className="legal-main">
    <header className="legal-header"><span className="legal-kicker"><Icon size={17} /> HIRELO / LEGAL</span><h1>{title}</h1><p>{summary}</p><span className="legal-version">Last updated: September 23, 2026</span></header>
    <div className="legal-layout"><aside><nav aria-label="On this page"><span>ON THIS PAGE</span>{sections.map(([heading], index) => <a key={heading} href={`#section-${index + 1}`}>{String(index + 1).padStart(2, '0')} {heading}</a>)}</nav></aside>
      <article className="legal-content">{sections.map(([heading, text], index) => <section id={`section-${index + 1}`} key={heading}><span className="legal-number">{String(index + 1).padStart(2, '0')}</span><h2>{heading}</h2><p>{text}</p></section>)}<div className="legal-contact"><h2>Have a question?</h2><p>Get in touch about your account, your information, or these policies.</p><Link to="/contactus">Contact Hirelo<ArrowUpRight size={16} /></Link></div></article>
    </div><div className="legal-related"><Link to={type === 'terms' ? '/privacy-policy' : '/terms'}>{type === 'terms' ? 'Read our Privacy Policy' : 'Read our Terms of Service'}<ArrowUpRight size={16} /></Link></div>
  </main><Footer /></div>
}
