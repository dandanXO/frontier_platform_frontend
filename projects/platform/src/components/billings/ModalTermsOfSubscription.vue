<template lang="pug">
modal-behavior(:header="title")
  f-scrollbar-container(class="w-195 h-123 pb-4 -mx-8 px-8 mb-4")
    p(class="text-body2 text-grey-900 leading-1.6 pb-10" v-html="introduction")
    div(class="grid gap-y-12.5")
      div(v-for="(section, index) in sectionList")
        p(class="text-body1 font-bold text-grey-900 pb-5 border-b border-grey-200 mb-4") {{ index + 1 }}. {{ section.title }}
        p(v-html="section.content" class="text-body2 text-grey-900 leading-1.6")
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalTermsOfSubscription',
  setup () {
    const { t } = useI18n()
    const title = 'Frontier Subscription Service Agreement'
    const introduction = `
      This Subscription Service Agreement (hereinafter referred to as the “Agreement”) is deemed to be a supplement to, and an integral part of, the Frontier User Terms and Conditions and forms an integral part thereof. In the event of any conflict between this Agreement and the above terms and conditions, this Agreement shall prevail. <br/>
      <br/>
      Under this Agreement, Frontier.cool Inc. (hereinafter referred to as "Frontier", "We", "Our" and the Company's basic information is set forth below) authorizes you to use Frontier's website on the Frontier.cool domain (hereinafter collectively referred to as the Platform) to connect over the Internet, upload digital content, search for digital content on the Platform, or other related services (hereinafter referred to as the "Service"). Hence, both parties agree that the rights and obligations of the Service shall be governed by this Agreement.
    `
    const sectionList = [
      {
        title: 'Agreement Review Period and Basic Information of Contracting Parties',
        content: `
          1. You have reviewed all of the terms of this Agreement for more than 3 days.
          <br/>
          2. You, the successful Frontier Subscriber (hereinafter refer to as the  “Member”), have gone through the following process on the Platform, and your personal information and subscription details are set out on your Member page.
          <br/>
          3. Frontier.cool Inc (Frontier) <br/>
          &nbsp&nbsp&nbsp&nbsp 3.1 Person-in-Charge: CHAO, Chun-Pu <br/>
          &nbsp&nbsp&nbsp&nbsp 3.2 Contact phone number: 02-275288555 <br/>
          &nbsp&nbsp&nbsp&nbsp 3.3 Customer Service Email: support@frontier.cool <br/>
          &nbsp&nbsp&nbsp&nbsp 3.4 Business Address: Floor 7-3, No.57, Fuxing North Road, Songshan District, Taipei City <br/>
          &nbsp&nbsp&nbsp&nbsp 3.5 Tax Id Number: 83613618 <br/>
          <br/>
        `
      },
      {
        title: 'The Service Content',
        content: `
          The Service Content includes the following sections: <br/>
          <br/>
          1. Frontier's website for this service: Frontier.cool and Frontier’s App <br/>
          2. Frontier provides this service to: No restriction <br/>
          3. Frontier provides this service content: based on the subscription service purchased by members, including and not limited to cloud storage space, uploading digital content, user chat rooms, and so on. <br/>
          4. Frontier provides the cloud storage space capacity of the Service and the permitted team members as outlined in "My Plans" on your member page.
        `
      },
      {
        title: 'Equipment Specification ',
        content: `
          Except as mutually agreed that Frontier is the provider of the access network for the equipment in the server room connected to Frontier's designated website system, you shall apply for a lease from a legally operated telecommunications company, and your rights and obligations arising from the lease of such access network shall be governed by the contract between you and the telecommunications company.
        `
      },
      {
        title: 'Establishment and Validity of Agreement',
        content: `
        1. If you purchase the Service via the Internet, you will check the "Confirm" button on the web page designated by Frontier to indicate your agreement to purchase the Service and to use electronic documents as a means of representation, and Frontier will immediately use the Platform's reconfirmation mechanism for you to confirm the contents of the electronic documents. Upon your re-confirmation, the Agreement is established and takes effect. <br/>
        2. Except for the above mentioned situation, this Agreement shall be established and effective upon the signature or seal apposition of both parties on this Agreement.
        `
      },
      {
        title: 'Statutory Agent',
        content: `
          1. In case you are a person limited in capacity to make juridical acts, this Agreement shall be made with the consent of your statutory agent to be valid; if you are a person with no (legal) capacity, this Agreement shall be made by your statutory agent. <br/>
          2. In the event of a breach of the previous paragraph, except in the case of Article 83 of the Civil Code, this Agreement shall not be valid and Frontier shall not hold your statutory agent liable for its performance or indemnification. <br/>
          3. A person who is limited in capacity to make juridical acts shall inform Frontier, on his/her initiative, before entering into the terms of this Agreement.

        `
      },
      {
        title: 'Period of Service',
        content: `
          When the Service is available for use, you are deemed to have been delivered the service when you search for digital content or upload digital content from your device. In addition, Frontier will continue to provide the services on the Platform after you have legally purchased the services according to this Agreement, provided that you have not breached this Agreement or any applicable law or regulation.
        `
      },
      {
        title: 'Guarantee of Authorization',
        content: `
          1. Frontier shall ensure that it is the legal right holder of the service content authorized to be used by you under this Agreement. <br/>
          2. In the event that Frontier violates the preceding paragraph and gives rise to your inability to continue using Frontier, Frontier will compensate you for the loss of use by extending the period of use, subject to the amount of the license fee paid by you. <br/>
          3. You are strictly prohibited from transferring your rights to use the Service to others without Frontier's prior written consent, including, but not limited to, sharing your member account, share streaming or public use.

        `
      },
      {
        title: 'Licensing Fee',
        content: `
          1. The amount of the service license fee is as stated in the Platform Scheme, which generally adopts a prepayment monthly fee system and the consultant fee is charged by hourly rate. <br/>
          2. Frontier may offer you space or other services at a discounted rate, and you have the right to purchase additionally. <br/>
          3. If you purchase the services under the aforementioned special offer, the provisions of Paragraph 2, Article 15 shall apply mutatis mutandis upon the termination of the Agreement. <br/>
          4. Frontier will not seek a refund from you of the gift given to you under the name of "discount" at the time of termination or cancellation of this Agreement, nor will Frontier claim from you a deduction of the amount of the discount from the amount of the fee reimbursement. <br/>
          5. If Frontier modifies its rates, Frontier shall notify the user by website or email no later than 30 days before the next debit date.
        `
      },
      {
        title: 'Licensing Principles',
        content: `
          1. You shall be solely responsible for all legal liability for any of the following and Frontier may terminate this Agreement immediately upon notice, which you may not refuse: <br>
          &nbsp&nbsp&nbsp&nbsp 1.1 You maliciously disseminate computer programs that interfere with the normal operation of the Platform system, or perform any action on the Platform including, but not limited to, modifying, replicating, reverse engineering, disassembling of any function, or any attempt to obtain the source code or content of any program, and so on. <br/>
          &nbsp&nbsp&nbsp&nbsp 1.2 You post threatening, defamatory, invasive, pornographic, or other texts, pictures, or images that violate mandatory or prohibited regulations or public order and morals on the Platform. <br/>
          &nbsp&nbsp&nbsp&nbsp 1.3 You engage in any other conduct that violates the Frontier User Terms. <br/>
          2. In the preceding case, Frontier reserves the right, at its sole discretion, to immediately cease transmission (to remove) of any such content and to take appropriate action, including, without limitation, suspending your use of the Service, in whole or in part, exiting such content, or maintaining a record of such use. <br/>
          3. Frontier may terminate this Agreement immediately upon notice to you if you use the Platform to engage in other unlawful acts or conducts, the circumstances of which are significant, in violation of this Agreement, or if you have been notified by Frontier that you have three (3) days to remedy the situation and have not done so by that time. You may not refuse to do so. <br/>
          4. Where Frontier terminates this Agreement under the provisions of Subparagraphs 1 and 3 hereof, the provisions of Subparagraph 15 shall apply mutatis mutandis.
        `
      },
      {
        title: 'Your Obligations',
        content: `
          1. You are obligated to pay the license fee for the use of the Service. <br/>
          2. You must keep your member account and personal password safe from third parties’ knowledge. <br/>
          3. Your use of the Service is subject to your obligation to comply with the Authorized Use Policy outlined in this Agreement. <br/>
          4. You should notify Frontier promptly of any error or change in the personal information you have registered under this Agreement, for correction. You shall be responsible for any damage to your rights caused by your failure to do so. <br/>
          5. You shall provide and continue to maintain the truthfulness and completeness of all personal information used to create the account, and all personal information shall be considered a required element of registration. Any false or incomplete information provided at the time the account was created shall be deemed a breach of this Agreement. <br/>
          6. You are responsible for all activities and actions you take after logging in to the system with your member account, including but not limited to the deriving related costs. <br/>
          7. You may not reproduce, publicly transmit, resell, publicly play, publicly share, or download or use the Service in ways other than the Platform.

        `
      },
      {
        title: 'Handling of illegal use of account passwords',
        content: `
          1. The use of your member account and personal password to access the platform is presumed to be your behavior. <br/>
          2. If you discover that your member account or password has been used by a third party inappropriately or unlawfully, you should notify us immediately. If you confirm that your account or password has been misused by a third party, we will immediately suspend the use of the account or password and accept a change of your account or password.
        `
      },
      {
        title: 'Service Quality',
        content: `
          1. Frontier shall provide the Service with reasonably expected security and shall ensure that its system equipment is free from errors, screen freezes, delays, interruptions, or inability to connect. <br/>
          2. Shall Frontier violate any of the foregoing provisions for any reason attributable to it, Frontier shall promptly correct or remedy the breach within 72 hours. You waive all claims against us for special, indirect and consequential damages, except to the extent that such rights cannot be waived by law. <br/>
          3. You understand that the Digital Content on the Frontier Platform is provided by each User in conjunction with Frontier and that Frontier makes every effort to ensure the accuracy of the Digital Content provided by the User. In the event you notify us that there may be errors in the Digital Content, we will assist you in confirming the content with the User and will complete the initial confirmation with the User within 5 business days from the date of notification or knowledge. <br/>
          4. You may terminate this Agreement by notifying Frontier immediately after Frontier fails to repair or correct, as per the provisions of the Agreement, any major system malfunctions or digital content errors that have occurred more than 5 times during the use of the service. Frontier shall not object to this action and shall return your licensing fee mutatis mutandis following Article 15. <br/>
          5. When you use this Service, Frontier will immediately correct or fix digital content errors, website system freezes, interruptions, unavailable connections, or other defects in the quality of the Service that are attributable to third parties with whom Frontier works. <br/>
          Frontier will not be liable for services provided by third parties. In addition, your use of services provided by third parties is subject to the terms, conditions, restrictions, requirements, etc… established by such third parties. <br/>
          6. Frontier does not guarantee the following: <br/>
          &nbsp&nbsp&nbsp&nbsp 6.1 That the Service will meet your specific requirements. <br/>
          &nbsp&nbsp&nbsp&nbsp 6.2 That any product, service or other information purchased or obtained from Frontier will meet your expectations and your use of the Service is at your discretion and risk. <br/>
          &nbsp&nbsp&nbsp&nbsp 6.3 The authenticity, suitability or legality of any information not issued or published by Frontier.
        `
      },
      {
        title: 'Suspension of Service',
        content: `
          1. Frontier may suspend all or part of the Service when it is necessary for the relocation, replacement, upgrade, maintenance, or repair of software and hardware equipment necessary for the operation of this Service. <br/>
          2. If Frontier suspends the Service, in whole or in part, for any of the abovementioned reasons, Frontier shall notify you at least 7 days before such suspension by posting an announcement on the home page of the Service and while it is in progress. Frontier will also notify you by e-mail of any such suspension, except where such suspension is temporary, urgent, or for reasons not attributable to Frontier.
        `
      },
      {
        title: 'Modification of the Agreement',
        content: `
          1. Shall Frontier modify this Agreement, it shall post a notice on the Platform 30 days in advance and notify you by email. <br/>
          2. Shall you have no objection and continue to use the Service, Frontier will continue to provide the Service as modified in the Agreement. <br/>
          3. In the event you do not agree with the change in subparagraph 1 of this Article, you may, within 30 days of the announcement, assert to Frontier the termination of the Agreement. Frontier shall reimburse you the amount of the Service license fee following Article 15.
        `
      },
      {
        title: 'Termination of the Agreement and Refund',
        content: `
          1. You or the person designated by you when subscribing to the Services may notify Frontier of the termination of the Agreement due to a change to its content and Frontier may not refuse to: <br/>
          &nbsp&nbsp&nbsp&nbsp 1.1 If the Service is terminated during the month of the debit, Frontier shall discontinue the Service on the date of receipt of the termination of the Agreement and give a pro-rata refund. <br/>
          &nbsp&nbsp&nbsp&nbsp 1.2 If Frontier service is available until the end of the month and will be terminated at the end of the month with no further deduction. <br/>
          2. Upon termination of the Agreement, Frontier shall settle and pay the license fee for the Service in the manner outlined in the preceding paragraph.
        `
      },
      {
        title: 'Right to Complain',
        content: `
          In addition to calling Frontier, you may also file a complaint by email or in writing regarding this service provided by Frontier, and Frontier shall address your complaint appropriately within 15 days from the date of its receipt.
        `
      },
      {
        title: 'Liability for Damage',
        content: `
          You warrant that you will be liable for any loss, liability, damages or expenses (including, but not limited to reasonable attorneys' fees) of Frontier Service Group and its management, directors, employees, agents, and contractors, arising from any claim or demand related to a) contents you have posted or submitted b) the use of the Platform c) your breaching of this Agreement and d) your use of the Platform in violation of any third-party rights.
        `
      },
      {
        title: 'Others',
        content: `
          1. Frontier will issue and send you an electronic invoice after you subscribe to the service. <br/>
          2. However, if you subscribe to the service from outside Taiwan, Frontier is exempted from giving you a uniform invoice under the tax laws of the Republic of China.
        `
      },
      {
        title: 'Annexures to the Agreement',
        content: `
          1. The Annexures to this Agreement form an integral part of this Agreement. <br/>
          2. In the event of any conflict between the contents of the aforementioned annexures and the terms and conditions of this Agreement, the conditions that apply shall be those in your favor. <br/>
          3. Upon the establishment of this Agreement, Frontier will make this Agreement and related annexures available for you to download, print and save.
        `
      },
      {
        title: 'Jurisdiction',
        content: `
          The parties hereto agree that all disputes arising out of, in relation to, or in connection with this Agreement shall be submitted to Taiwan Taipei District Court.
        `
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
