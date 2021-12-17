<template lang="pug">
div(class="w-213.5 px-8")
  p(class="text-body1 text-primary font-bold text-center pb-7.5") {{title}}
  overlay-scrollbar-container(class="h-123 pb-4 -mx-8 px-8 mb-4")
    p(class="text-body2 text-primary line-height-1.6 pb-10") {{introduction}}
    div(class="grid gap-y-12.5")
      div(v-for="section in sectionList")
        p(class="text-body1 font-bold text-primary pb-5 border-b border-black-400 mb-4") {{section.title}}
        p(v-html="section.content" class="text-body2 text-primary line-height-1.6")
</template>

<script>
export default {
  name: 'ModalPrivacyPolicy',
  setup () {
    const title = 'FRONTIER PRIVACY POLICY'
    const introduction = 'On Frontier\'s website, Frontier.cool (hereinafter referred to as "Frontier", "We", "Our"), we value your privacy rights sincerely, and this privacy policy describes how we collect your personal data, how it is processed and used, as well as how you can manage and control the related information about you collected through Frontier. We recommend that you read this Privacy Policy and our User’s Terms of Use carefully before using our website, services and transact with us. By continuing to use Frontier, you are accepting the practices described in this Privacy Policy and agreeing to our collection, processing and use of your personal data.'
    const sectionList = [
      {
        title: 'Types of personal data collected',
        content: `
          When you visit or use Frontier, we may collect your personal data including, but not limited to, the following: <br/>
          <br/>
          1. The actions you perform and the information you provide <br/>
          Including but not limited to: Name, region, e-mail address, company name and address, Facebook, LINE ID and UID, and fabric cloth information (e.g., Modify textile, Items#*, Description, Weight*......, fabric cloth related attachments, and so on). <br/>
          <br/>
          2. The information we collect automatically <br/>
          Including but not limited to: User actions on the platform (including the use of functions, number of times, word search, etc...), dialog record, and the U3M generated from the fabric cloth. <br/>
          <br/>
          3.   Information from collaborative partners <br/>
          Including but not limited to: Mobile phone number, name, first six and last four codes of the card number, card expiration time, type and grade, card issuing bank and country of issuing bank, uniform invoice number, random code and date of invoice, carrier type, mobile phone carrier barcode, Citizen Digital Certificate, donation invoice's love code, company's Tax ID number, and invoice letterhead. <br>
          <br/>
          Frontier complies with the privacy policy and advertising guidelines of the Google website and the personal data collected with your authorization will only be used to assist Frontier in providing services to you. Frontier only collects and uses your e-mail account to provide customized content and services when you are logged in with Google. <br/>
          <br/>
          When you purchase any service from Frontier, your filled-in personal financial information, including credit card information, will be collected, processed and utilized through our third-party payment flow (including but not limited to Green World Fintech, Neweb Technologies and LINE Pay), but Frontier will not collect or process the corresponding personal financial information. <br/>
          <br/>
          If Frontier holds any event, the contact information you provide to Frontier for that event will be used solely for that event.
        `
      },
      {
        title: 'Cookies',
        content: `
          We set up and access cookies on your computer, which are small-sized information files that are stored in your web terminal memory or mobile device by your web browser. The type of cookies is divided into session cookies and persistent cookies. The former does not have a definite retention period and it will be automatically deleted when you close your browser. The latter has a certain retention period (for example, one month) unless the period expires or you delete it manually. The persistent cookie will remain on your computer or mobile device until the expiration date or you manually delete it. <br/>
          <br/>
          Depending on the functional differentiation of the cookie, there are several types as follows: <br/>
          <br/>
          1. Essential cookies: These cookies are necessary to maintain the operation of the Frontier website and if deleted will prevent the website from functioning properly. <br/>
          <br/>
          2. Security cookies: This type of cookie is used to authenticate users and prevent fraudulent use of sign-on authentication. <br/>
          <br/>
          3. Functional cookies: These cookies remember your browsing preferences, such as your browsing history, language and region, type of mobile device, etc., to provide a browsing experience that best meets your needs. <br/>
          <br/>
          4. Analytical cookies: These cookies allow Frontier to collect information about how you use the site, such as which pages you browse most often, to analyze whether there are areas of the site that need improvement to provide you with a better experience. <br/>
          <br/>
          5. Advertising cookies: These cookies are used for precision marketing purposes, such as providing information about digital content that may be of interest to you based on content that you have clicked on in the past. <br/>
        `
      },
      {
        title: 'Purpose of Personal Data Collection and Processing',
        content: `
          We may collect and process your personal data for the following detailed purposes: <br/>
          <br/>
          1. To ensure that the content of our website is displayed in the most effective way for you. <br/>
          2. To manage your account. <br/>
          3. To provide services to you. <br/>
          4. To provide information security. <br/>
          5. To provide technical support. <br/>
          6. To maintain the website operation. <br/>
          <br/>
          In addition, with your explicit prior consent, we may process your personal data for the following purposes: <br/>
          1. To provide you with information that may be of interest to you. <br/>
          2. To use your personal data in conjunction with a third party who may provide you with information about their products and services. <br/>
          3. To conduct business analysis. <br/>
          <br/>
          You may withdraw your consent at any time. However, the legality of the processing of personal data before the withdrawal is not affected by the withdrawal of consent.
          We will not process your personal data for purposes other than those reasonably described above, nor will we further process it in a manner inconsistent with those purposes. We will notify you if we anticipate using personal data originally collected for a specific purpose for another purpose.
        `
      },
      {
        title: 'Security Measures',
        content: `
        We will handle your personal data in a manner that ensures proper security. To achieve this level of protection, the following actions have been taken: <br/>
        <br/>
        1. Ensure that personal data collection is minimized and that no personal data is collected for purposes other than processing; <br/>
        <br/>
        2. Use encryption technology to ensure the confidentiality of personal data transmission and storage. Use trusted protection mechanisms to prevent malicious attacks on servers that store information. <br/>
        <br/>
        3. Establish access control mechanisms to ensure that only authorized personnel have access to personal data, and control the number of authorized personnel and the hierarchical management of authorized personnel according to business needs and personnel levels; <br/>
        <br/>
        4. We will do our best to protect your personal data. However, no security measure can be infallible, and no service, website, information transmission, or Internet connection is completely secure. <br/>
        `
      },
      {
        title: 'Retention period of personal data',
        content: `
          Unless required by law or in case you request a longer retention period, we will retain your personal data only for as long as necessary to fulfill the purposes of use described in this policy. The retention period may vary depending on the purpose of processing and the related services.
        `
      },
      {
        title: 'Personal Data Sharing Policy',
        content: `
          Except as otherwise provided in this Policy, in compliance with regulatory disclosures, or to avoid any threat to you or other users, we will not provide your personal data to third parties without your consent and authorization. If Frontier works with a third party, the third party's privacy policy will also apply.<br/>
          <br/>
          If Frontier merges with another company or is acquired, or we sell some or all of our assets to a third party We will transfer your personal data to such third party under the terms of the transaction. We will notify you, before the transfer of your personal data, that the third party's privacy policy will apply to the treatment of your information after the transfer.
        `
      },
      {
        title: 'Shared Information',
        content: `
          The personal data collected by Frontier will be processed at the Frontier host computer. Some features of the site allow you to share content publicly, and when you use these features, you agree and understand that the content you post will be available to the public. Any unspecified third party may have access to it. In addition, if a user establishes a multi-person team, the manager of the team will have access to and use some of the features of the team members.
        `
      },
      {
        title: 'Privacy Policy Update',
        content: `
          Frontier's Privacy Policy may change from time to time in response to the needs of our business. Unless otherwise stated, all revisions will be effective automatically from the date of posting, so please review this policy periodically. If we make any material changes to our privacy policy (such as changes in the scope and purpose of use of the personal data collected), we will notify you by appropriate means and obtain your consent.
        `
      },
      {
        title: 'Personal Data Rights',
        content: `
          You have the following rights concerning the personal data we collect and process: <br/>
          <br/>
          You have the right to request access to and/or correction of any personal data that we hold about you. We will ask you to verify your identity before we process your request. Once we have sufficient information to process your request to access or correct your personal data, we will respond to your request within the period required by applicable law. <br/>
          <br/>
          Based on your request, we can provide free of charge a record of your personal data that we have collected and processed, and if you make other requests for relevant data, we may charge you a reasonable fee based on applicable relevant laws and the actual administrative costs. <br/>
          <br/>
          If you wish to request access to our personal data, or if you believe that any information we hold about you is incorrect or incomplete, please contact us by email. <br/>
          <br/>
          If you are a subscriber within the scope of the “General Data Protection Regulation” (GDPR), you will have the right to: <br/>
          <br>
          1. Request us to delete your personal data in compliance with the GDPR. We will evaluate your request and, if it complies with the GDPR, we will take the appropriate steps, including technological methods, to process it. <br/>
          <br/>
          2. To object to or restrict our processing of your personal data in compliance with the GDPR. We will evaluate your request for restriction and, if it complies with the GDPR, we will process your data following the specific circumstances applicable under the regulation and notify you before lifting the restriction on processing. <br/>
          <br/>
          3. Eliminating automated decision-based processing (including user portraits) and so on can have a legal or equivalent impact on you. <br/>
          <br/>
          4. Request to receive your data in a structured, generic, machine-readable form and transfer it to other data controllers. <br/>
          <br/>
          However, to the extent permitted by law, we must retain some of your data, and when you make the aforementioned request, you understand that the request will result in Frontier not being able to provide some or all of the functionality.
        `
      },
      {
        title: 'Cross-border transfer of personal data',
        content: `
          Your personal data may be transferred to a jurisdiction other than the country in which you are using your service, or accessed by visitors from those jurisdictions. <br/>
          <br/>
          Jurisdictions in which such personal data is stored may have personal data protection laws with varying degrees of protection, or even no such laws at all. We will ensure that your personal data is protected by applicable laws and regulations and by this Policy.
        `
      },
      {
        title: 'Information on minors and/or other individuals',
        content: `
          In some instances, you may provide information about minors and/or other individuals, in which case you declare and warrant that you are authorized to provide such information to us and that you have their consent to process the information in the manner outlined in the Privacy Policy. <br/>
          <br/>
          As a parent or legal guardian, please do not allow minors in your care to submit information to us (if applicable). By providing such information to us, you hereby consent to the processing of the minor's information and you accept and agree to be bound by the Privacy Policy and to accept responsibility for their conduct.
        `
      },
      {
        title: 'Third-Party Links',
        content: `
          If you have any question about this privacy policy, please feel free to contact us by email at: support@frontier.cool
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
