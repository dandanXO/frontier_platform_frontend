<template lang="pug">
div(class="w-213.5 px-8")
  p(class="text-body1 text-primary font-bold text-center pb-7.5") {{title}}
  overlay-scrollbar-container(class="h-123 pb-4 -mx-8 px-8 mb-4")
    p(class="text-body2 text-primary line-height-1.6 pb-10") {{introduction}}
    div(class="grid gap-y-12.5")
      div(v-for="(section, index) in sectionList")
        p(class="text-body1 font-bold text-primary pb-5 border-b border-black-400 mb-4") {{index+1}}. {{section.title}}
        p(v-html="section.content" class="text-body2 text-primary line-height-1.6")
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalTermsOfUse',
  setup () {
    const { t } = useI18n()
    const title = 'Frontier Terms of Use'
    const introduction = 'Frontier is a collaborative digital platform for the textile industry. Frontier allows members to search for or upload digital content and seek matching opportunities with other members.The Terms of Use (hereinafter referred to as "Terms") apply to all websites located on and linked to the Frontier.cool domain (hereinafter referred to as "Frontier"  "We"  "Our") and Frontier is the property of Frontier.cool Inc., its subsidiaries and its affiliates (hereinafter referred to as "Frontier Service Group").'
    const sectionList = [
      {
        title: 'Articles of Agreement',
        content: `
          These Terms apply to all members or visitors (hereinafter termed as "Users", "You") who link to Frontier, regardless of the physical location of the individual User. By continuing to use the services provided by Frontier, You acknowledge and agree to these Terms, and if You do not agree to some or all of these Terms, You shall immediately cease using Frontier. For more information about subscription services, please refer to: Frontier Subscription Service Agreement (hereinafter referred to as the "Subscription Agreement"), and please also read our Privacy Policy before you use Frontier. <br/> 
          <br/>
          If you have any questions, please contact our Customer Service staff directly at any time. <br/>
          <br/>
          If you apply for registration as a member on behalf of your employer or other party and continue to use the services provided by Frontier, you declare and warrant that (i) you are fully authorized by law to bind your employer or applicable party to these Terms; (ii) you have read and understood the “User Terms of Use” and “Privacy Terms”; and (iii) you agree to the terms and conditions of this ‘Agreement” on behalf of the party you represent. If you do not have the legal rights to bind your employer or related entity, do not click on the [I Accept] button below. This "Agreement" governs the "User's" access to and use of the "Service"; the "Service" is governed by the relevant subscription plan.
        `
      },
      {
        title: 'Update of this Clause',
        content: `
          Frontier Service Group reserves the right to modify or adjust any of the terms of these Terms at any time to the extent permitted by law. If Frontier Service Group modifies or adjusts these Terms, Frontier will announce it by posting a notice. Any modifications or adjustments will be effective upon such announcement. If the User continues to use the services provided by Frontier after the revision notice, then you are giving your valid and irrevocable consent to these Terms as changed. Therefore, you must review these Terms of Use regularly to ensure that you are aware of all changes to these Terms of Use. If you do not agree with any changes to these Terms of Use, you should leave the Frontier Site and cease using the Frontier Services immediately, and you should notify Frontier to delete your profile and cancel your membership. Frontier Service Group also reserves the right to delete a member's profile and cancel membership in the event of a specific breach.
        `
      },
      {
        title: 'Member’s Account and Password Security',
        content: `
          The content on Frontier is available to all users, whether they are visitors or members, but only those who are registered members can subscribe to the service and take advantage of Frontier's continuously updated services. Visitors can easily create an account on Frontier by entering their email or logging in with their registered Google account. <br/>
          <br/>
          Users should not create an account name using any information unrelated to their real personal data, including, but not limited to, the use of impersonations of other people's names or the use of offensive words, any racial slur or any word that would harm or violate the rights of others, and Frontier reserves the right to terminate the service of that account if such events occur. Before creating an account and subscribing to any service (after subscribing to the services, that is, per the subscription service agreement), members should pay attention to the following matters: Members should keep their accounts and passwords safely, should not transfer or lend their accounts and passwords to others. Shall members find that their accounts are being used by others illegally, they should notify Frontier immediately. Frontier will not be responsible for any illegal use of your account or password due to hacking or member's negligent safe keeping, and Frontier will have the right to recover any expenses incurred by Frontier as a result. <br/>
          <br/>
          You are under an obligation to keep your account, password, and other relevant identification information, and to be responsible for all activities, actions, including, but not limited to, the associated costs incurred after logging into the system for this account. <br/>
          <br/>
          You agree to comply with all applicable laws in your use of Frontier and to use the Service only for lawful purposes. Any use of the Service or access to the System other than with Frontier's consent or direction is strictly prohibited, and Frontier reserves the right to discontinue providing the Service to such User, to freeze or withdraw the registration account, and to require you to indemnify Frontier for any losses incurred by Frontier.
        `
      },
      {
        title: 'Privacy Policy',
        content: `
          Personal information provided by the User and certain other information retained by Frontier Service Group in connection with the User will be governed by the laws of the Republic of China and Frontier's Privacy Policy.
        `
      },
      {
        title: 'Usage Specification and Accountability',
        content: `
          Any text, document, video, photograph (including a photograph of the User), picture, sound, musical composition, creative work, or any other content (hereinafter referred to as "Content") that you upload, post, email, or otherwise transmit, whether publicly or privately, in connection with your use of Frontier's services shall be of legal origin. <br/>
          <br/>
          Where the relevant content relates to the legal rights of any third party, the appropriate permission shall be obtained accordingly. If Frontier receives a related report or complaint involving you, Frontier may provide the necessary information, including the account number, to the relevant disputing parties and relevant departments through the channels required or permitted by relevant laws and regulations to resolve the dispute and protect the legitimate rights and interests of the rightful owner. Frontier is not responsible for any unauthorized content uploaded by any member. <br/>
          <br/>
          In the course of using the services provided by Frontier, you shall comply with applicable laws and regulations and shall not engage in conduct that interferes with the normal provision of the services or is detrimental to the legitimate interests of others. In particular: <br/>
          <br/>
          1. Content that violates laws and regulations or infringes the rights of third parties should not be uploaded, posted, e-mailed or transmitted in any other way.<br/>
          <br/>
          2. Frontier and Frontier's digital content cannot be downloaded, reproduced, publicly transmitted, resold, publicly played, shared, or used. <br/>
          <br/>
          3. Not to modify, replicate, reverse engineer, disassemble or engage in any attempt to obtain source code or content for any function or program; <br/>
          <br/>
          4. Transactions or participation in any activity organized by Frontier shall not be affected by infringing on the legitimate rights and interests of third parties, cheating, disrupting the system, carrying out cyber-attacks, registering in bulk, registering Frontier accounts with a machine; <br/>
          <br/>
          5. Digital content that cannot be uploaded, including any commercial or embedded advertising business content; <br/>
          <br/>
          6. No engagement in activities that endanger the security of computer information networks, such as: (a) cracking, destroying, deleting, modifying or adding to network services and related software and hardware facilities; (b) deleting, modifying or adding to data and applications stored or transmitted in the computer information network; (c) using software or hardware to steal other people's passwords or illegally hack into other people's computer systems; (d) intentionally creating or spreading destructive programs such as computer viruses; (e) other activities that endanger the security of computer information networks; <br/>
          <br/>
          Shall you be involved in one or more of the above behaviors during the use of Frontier Services, you shall be held liable for your actions. Liability may take the form of, but is not limited to, indemnification of the person who has been harmed and the payment of an equal amount of compensation to Frontier immediately after Frontier Service Group and its management, directors, employees, agents and contractors have first incurred administrative penalties or liability for tort damages (including court costs, attorneys' fees and other related legal proceedings) as a result of your actions. <br/>
          <br/>
          In addition, based on the specific circumstances of the violation, Frontier reserves the right to make an independent judgment and unconditionally take down or remove the illegal or non-compliant content, investigate and collect evidence depending on the current situation, and keep relevant records (or report to the relevant authorities), or immediately suspend or terminate part or all of the services provided to you, including measures such as locking, canceling or deleting accounts.
        `
      },
      {
        title: 'Third-Party Payment Financial Services',
        content: `
          Frontier's service fees are collected through third-party payment flows, providing members with a variety of collection mechanisms to choose from. Each collection mechanism is independently operated by the third-party payment processors (including but not limited to Green World Fintech, Neweb Technologies and LINE Pay) and is not operated or controlled by the platform. Members should understand the service terms and conditions of the third-party payment processor when choosing its services, and operate following the specifications and procedures of the third-party payment processor, and bear the related handling fees. <br/>
          <br/>
          The services between the members and the third-party payment processor are contractual relationships between the members and the third-party service merchant and have nothing to do with the Platform. Unless there is intentional fault on the part of the Platform, any dispute, doubt or loss (e.g. system irregularity, fraudulent use, improper human operation, etc.) shall be resolved by coordination between the members and the third-party payment processor, and the Platform shall not be responsible for guarantee, coordination, recovery, assistance in litigation, performance, refund or compensation.
        `
      },
      {
        title: 'Uniform Invoice Issuance',
        content: `
          Frontier will issue and provide invoices to Users after they subscribe to the service (not limited to the purchase of cloud storage space and membership access). <br/>
          <br/>
          In the event users subscribe to the service outside of Taiwan, Frontier are exempt from the issuance of uniform invoices under the tax laws of the Republic of China.
        `
      },
      {
        title: 'Third-Party Links',
        content: `
          Frontier may contain links to third-party websites other than Frontier. Since Frontier has no control over these websites and resources, Users are responsible for understanding the terms of use and privacy policies of each such third-party website before using such site.
        `
      },
      {
        title: 'Intellectual Property Rights',
        content: `
          You understand and acknowledge that, unless otherwise stated in writing, the intellectual property rights (including but not limited to patents, copyrights, trademarks and trade secrets) in the following information and contents are owned by Frontier: <br/>
          <br/>
          1. Contents and information (including, but not limited to, software, technology, programs, web pages, text, pictures, images, maps, icons, audio, video, charts, layout design, electronic documents and data) provided in connection with the Frontier Related Services; <br/>
          <br/>
          2. Frontier's information infrastructure and platform (including, but not limited to, software, websites and applications, and so on) used to deliver the aforementioned contents and information; <br/>
          <br/>
          3. Each trademark, corporate identity, business logo, technology know-how, slogan and copy used in the provision of related services by Frontier; <br/>
          <br/>
          4. All data and information generated during the development, operation, maintenance, and so forth of Frontier services. <br/>
          <br/>
          The intellectual property rights of Frontier in respect of the aforementioned rights and of any content in the services rendered are protected by law, and you undertake not to engage in, or permit, or assist anyone to use, rent, lend, distribute, display, copy, modify, link to, reproduce, compile, publish, crawl, monitor, quote, or create derivative works in any form (including, but not limited to, through any robot, web crawler, screenshot, or other program or device) without the prior written permission of Frontier.<br/>
          <br/>
          You understand and agree that the content (including, but not limited to, text, graphics, video, audio, animation, etc.) that you upload, submit, store or post while using the services provided by Frontier is either created by you or has been legally licensed to you. The intellectual property rights of any content that you upload, submit, store or post through Frontier belong to you or the original copyright owner, and your upload, submission, storage, or posting does not infringe upon the intellectual property rights or other legal rights of others. <br/>
          <br/>
          You acknowledge, understand and agree that by accepting this Service Agreement, you are voluntarily granting to Frontier Service Group a worldwide, free, non-exclusive and irrevocable license to reproduce, use, publish, translate, publicly display, publicly transmit, publicly exploit, adapt, or create derivative works based on such license to all present or future platforms, or by modifying, reproducing, adapting, translating, compiling or producing the foregoing licensed contents. The intellectual property rights related to these derivative products shall belong to Frontier Service Group on the basis that they do not violate the mandatory provisions of relevant laws and regulations and respect the intellectual property rights of the relevant original licensed content. <br/>
          <br/>
          You confirm and agree to authorize the Frontier Service Group to independently, and autonomously, claim infringement of, and obtain full compensation for any infringement of the contents (including derivative works) that you upload, submit, store or post either on your behalf or on behalf of a professional third party. The form of the claim includes, but is not limited to, monitoring of infringements, sending of warning letters, filing of lawsuits or arbitration, mediation, settlement, and so forth. The Frontier Service Group reserves the right to make independent decisions on and implement the aforementioned measures. <br/>
          <br/>
          You agree that you will be fully liable for intellectual property rights infringement arising out of any content you uploaded and posted through Frontier and that you will indemnify Frontier Service Group in equal amounts for any damages arising from third-party claims of infringement of intellectual property rights.
        `
      },
      {
        title: 'Service Changes or Termination of Service',
        content: `
          The Frontier Service Group may delete a member's account and content after termination of the service, with or without notice, and may prevent such User from linking to or using Frontier in the future.
        `
      },
      {
        title: 'No Guarantee Disclaimer',
        content: `
          Unless otherwise expressly stated in writing, Frontier makes no declaration or warranty of any kind, express or implied, regarding the information, content, data, products or services on its website and clients, to the extent required by the law or regulations. <br/>
          <br/>
          In particular, Frontier does not warrant that: a) the service will meet the specific requirements of the User; b) any product, service, or information purchased or acquired from Frontier will meet the User's expectations; or c) the authenticity, applicability, or legality of any information not issued or published by Frontier. <br/>
          <br/>
          You understand and agree that, to the extent required by law, Frontier shall not be liable for damages arising from: <br/>
          <br/>
          1. Suspension or interruption of service due to repair, testing, setup, regular maintenance, computer failure or virus, data corruption or loss, or any other force majeure of the relevant website equipment. <br/>
          <br/>
          2. All text, images, videos, lectures, courses, services, events or all other materials provided by Frontier may be modified, taken down or removed due to the original author's request, license duration, infringement objections by third parties, platform management, and so on. <br/>
          <br/>
          3. The content, statements, opinions and comments posted by Users on the Platform may cause disputes between Users and each other or between Users and third parties. <br/>
          <br/>
          4. The account and password are used illegally by others due to inaccurate or non-updated User account information, or due to hackers, viruses, Trojan horses or members' negligence.
        `
      },
      {
        title: 'General Terms',
        content: `
          These Terms and the relationship between the User and Frontier shall be governed by the laws of the Republic of China. In the event of a dispute between you and Frontier concerning the Service, these Terms and Conditions, or any other matters, the court of first instance shall be the Taiwan Taipei District Court. If any part of these Terms is invalid due to conflict with the laws of the Republic of China, the other provisions of these Terms shall remain in full force and effect. The title of these Terms is for convenience only and shall have no legal or contractual effect.
        `
      },
      {
        title: 'Report',
        content: `If you find any violation of these Terms, please notify Frontier by emailing ${t('RR0139')}`
      },
      {
        title: 'Contact Us',
        content: `If you have any questions about these Terms of Service or our information handling practices, please contact us by email at ${t('RR0139')}`
      }
    ]
    return {
      title,
      introduction,
      sectionList
    }
  }
}
</script>
