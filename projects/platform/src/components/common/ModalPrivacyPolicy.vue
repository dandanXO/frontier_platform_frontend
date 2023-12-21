<template lang="pug">
modal-behavior(:header="title")
  f-scrollbar-container(class="w-195 before:h-123 pb-4 -mx-8 px-8 mb-4")
    p(v-html="introduction" class="text-body2 text-grey-900 leading-1.6 pb-10")
    div(class="grid gap-y-12.5")
      div(v-for="(section, index) in sectionList" :key="index")
        p(class="text-body1 font-bold text-grey-900 pb-5 border-b border-grey-250 mb-4") {{ section.title }}
        p(v-html="section.content" class="text-body2 text-grey-900 leading-1.6")
</template>

<script setup>
const title = 'FRONTIER PRIVACY POLICY'
const introduction = `
    Frontier. cool (“Company” or “We”) respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website Frontier.cool (our “Site”) and our practices for collecting, using, maintaining, protecting, and disclosing that information. Capitalized but undefined terms will have the meaning ascribed to them in the Company's Terms of Use. <br/>
    <br/>
    This policy applies to information we collect: <br/>
    <br/>
    <ul style="list-style: disc; padding-left: 32px;">
      <li>On this Site.</li>
      <li>In email, text, and other electronic messages between you and this Site.</li>
      <li>When you interact with our advertising and applications on third-party websites and services if those applications or advertising include links to this policy.</li>
      <li>When you create an Account and/or subscribe for the Services.</li>
      <li>It does not apply to information collected by: us offline or through any other means, including on any other website operated by Company or any third party; or</li>
      <li>Any third party, including through any application or content (including advertising) that may link to or be accessible from or on the Site.</li>
    </ul>
    <br/>
    Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Site. By accessing or using this Site, you agree to this privacy policy. This policy may change from time to time (see Changes to Our Privacy Policy). Your continued use of this Site after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
  `
const sectionList = [
  {
    title: 'Children Under the Age of 13',
    content:
      'Our Site is not intended for children under 13 years of age. No one under age 13 may provide any information to the Site. We do not knowingly collect personal information from children under 13. If you are under 13, do not use or provide any information on this Site or on or through any of its features. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 13, please contact us at support@Frontier.cool.',
  },
  {
    title: 'Customer Data',
    content: `
      Customer Data is controlled by the Customer or other Registered User. Where the Company collects or processes Customer Data, it does so on behalf of the Customer or Registered User. If you are using the Services by invitation of a Customer, whether that Customer is your employer, another organization, or an individual, that Customer determines its own policies regarding storage, access, modification, deletion, sharing, and retention of Customer Data which may apply to your use of the Services. Please check with the Customer about the policies and settings it has in place. <br/>
      <br/>
      The Company may access and use Customer Data as reasonably necessary and in accordance with Customer’s instructions to (a) provide, maintain and improve the Services; (b) to prevent or address service, security, technical issues or at a Customer’s request in connection with customer support matters; (c) as required by law and (d) as set forth in our agreement with the Customer or as expressly permitted in writing by the Customer.
    `,
  },
  {
    title: 'Information We Collect About You',
    content: `
      We collect several types of information from and about users of our Site, including information: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number, any other identifier by which you may be contacted online or offline;</li>
        <li>That is about you but individually does not identify you; and/or</li>
        <li>About your internet connection, the equipment you use to access our Site, and usage details. For Customers that purchase a paid version of the Services, our corporate affiliates, and our third party payment processors may collect and store billing address and credit card information on our behalf or we may do this ourselves.</li>
        <li>With your permission, any contact information you choose to import is collected (such as an address book from a device) when using the Services. When you use the Services our servers automatically record information, including information that your browser sends whenever you visit a website or your mobile app sends when you are using it. This log data may include your Internet Protocol address, the address of the web page you visited before using the Services, your browser type, and settings, the date and time of your use of the Services, information about your browser configuration and plug-ins, language preferences, and cookie data.</li>
        <li>We may collect information about the device you are using the Services on, including what type of device it is, what operating system you are using, device settings, application IDs, unique device identifiers, and crash data. Whether we collect some or all of this information often depends on what type of device you are using and its settings.</li>
        <li>Precise GPS location from mobile devices is collected only with your permission. WiFi and IP addresses received from your browser or device may be used to determine the approximate location.</li>
        <li>If, when using the Services, you integrate with a third party service, we will connect that service to ours. The third party provider of the integration may share certain information about your account with the Company. However, we do not receive or store your passwords for any of these third party services.</li>
        <li>The Company may also receive information from affiliates in our corporate group, our partners, or others that we use to make our own information better or more useful. This might be aggregate level information, such as which IP addresses go with which zip codes, or it might be more specific information, such as about how well an online marketing or email campaign performed.</li>
        <li>We gather user data in an anonymous manner, with the sole purpose of enhancing the performance of our AI systems and the user experience. We seek to retain rights to the 3D material data and associated metadata, with a focus on improving our services and offerings.</li>
      </ul>
    `,
  },
  {
    title: 'How We Collect Your Information',
    content: `
      We collect your information: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>Directly from you when you provide it to us</li>
        <li>Automatically as you navigate through the site. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.</li>
        <li>From third parties, for example, our business partners.</li>
        <li>Account creation information. Users may provide information such as an email address, phone number, and password to create an account.</li>
        <li>When a Customer creates a workspace using the Services, we may collect an email address, a workspace name, workspace photo, domain details, user name for the individual setting up the workspace, and password. We may also collect administrative team contact info, such as a mailing address.</li>
      </ul>
    `,
  },
  {
    title: 'Information You Provide to Us',
    content: `
      The information we collect on or through our Site may include: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>Information that you provide by filling in forms on our Site. This includes information provided at the time of registering to use our Site, subscribing to our service, posting material, or requesting further services. We may also ask you for information when you report a problem with our Site.</li>
        <li>Records and copies of your correspondence (including email addresses), if you contact us.</li>
        <li>Your responses to surveys that we might ask you to complete for research purposes.</li>
        <li>Details of transactions you carry out through our Site and of the fulfillment of your orders. You may be required to provide financial information before placing an order through our Site.</li>
        <li>Your search queries on the Site.</li>
      </ul>
      <br/>
      You also may provide information to be published or displayed (hereinafter, “posted”) on public areas of the Site, or transmitted to other users of the Site or third parties (collectively, “User Contributions”). Your User Contributions are posted on and transmitted to others at your own risk. Although we limit access to certain pages, please be aware that no security measures are perfect or impenetrable. Additionally, we cannot control the actions of other users of the Site with whom you may choose to share your User Contributions. Therefore, we cannot and do not guarantee that your User Contributions will not be viewed by unauthorized persons.
    `,
  },
  {
    title:
      'Information We Collect Through Automatic Data Collection Technologies',
    content: `
      As you navigate through and interact with our Site, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns, including: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>Details of your visits to our Site, including traffic data, location data, logs, and other communication data and the resources that you access and use on the Site.</li>
        <li>Information about your computer and internet connection, including your IP address, operating system, and browser type.</li>
      </ul>
      <br/>
      We also may use these technologies to collect information about your online activities over time and across third-party websites or other online services (behavioral tracking). The information we collect automatically may include personal information, or we may maintain it or associate it with personal information we collect in other ways or receive from third parties. It helps us to improve our Site and to deliver better and more personalized service, including by enabling us to: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>Estimate our audience size and usage patterns.</li>
        <li>Store information about your preferences, allowing us to customize our Site according to your individual interests.</li>
        <li>Speed up your searches.</li>
        <li>Recognize you when you return to our Site.</li>
      </ul>
      <br/>
      The technologies we use for this automatic data collection may include: <br/>
      <br/>
      Cookies (or browser cookies). A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser Cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Site. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Site. <br/>
      <br/>
      Flash Cookies. Certain features of our Site may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from, and on our Site. Flash cookies are not managed by the same browser settings as are used for browser cookies. For information about managing your privacy and security settings for Flash cookies, see Choices About How We Use and Disclose Your Information.
    `,
  },
  {
    title: 'Web Beacons',
    content: `
      Pages of our the Site and our e-mails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity).
    `,
  },
  {
    title: 'Third-Party Use of Cookies and Other Tracking Technologies',
    content: `
      Some content or applications, including advertisements, on the Site, are served by third parties, including advertisers, ad networks and servers, content providers, and application providers. These third parties may use cookies alone or in conjunction with web beacons or other tracking technologies to collect information about you when you use our website. The information they collect may be associated with your personal information or they may collect information, including personal information, about your online activities over time and across different websites and other online services. They may use this information to provide you with interest-based (behavioral) advertising or other targeted content. <br/>
      <br/>
      We do not control these third parties tracking technologies or how they may be used. If you have any questions about an advertisement or other targeted content, you should contact the responsible provider directly. For information about how you can opt-out of receiving targeted advertising from many providers, see Choices About How We Use and Disclose Your Information.
    `,
  },
  {
    title: 'How We Use Your Information',
    content: `
      We use information that we collect about you or that you provide to us, including any personal information: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>To present our Site and its contents to you.</li>
        <li>To provide and improve the Services.</li>
        <li>To provide you with information, products, or services that you request from us.</li>
        <li>To fulfill any other purpose for which you provide it.</li>
        <li>To provide you with notices about your account or subscription, including expiration and renewal notices.</li>
        <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
        <li>To notify you about changes to our Site or any products or services we offer or provide through it.</li>
        <li>To allow you to participate in interactive features on our Site.</li>
        <li>In any other way, we may describe when you provide the information.</li>
        <li>We use your personal information to operate, maintain, and improve our sites, products, and services.</li>
        <li>To respond to comments and questions and provide customer service.</li>
        <li>To communicate about promotions, upcoming events, and other news about products and services offered by us and our selected partners.</li>
        <li>To link or combine user information with other personal information.</li>
        <li>To protect, investigate, and deter against fraudulent, unauthorized, or illegal activity.</li>
        <li>For any other purpose with your consent.</li>
      </ul>
      <br/>
      We may also use your information to contact you about our own and third parties’ goods and services that may be of interest to you. If you do not want us to use your information in this way, please adjust your user preferences in your account profile. For more information, see Choices About How We Use and Disclose Your Information. <br/>
      <br/>
      We may use the information we have collected from you to enable us to display advertisements to our advertisers’ target audiences. Even though we do not disclose your personal information for these purposes without your consent, if you click on or otherwise interact with an advertisement, the advertiser may assume that you meet its target criteria. <br/>
      <br/>
      This policy is not intended to place any limits on what we do with data that is aggregated and/or de-identified so it is no longer associated with an identifiable User or Customer of the Services. <br/>
    `,
  },
  {
    title: 'Disclosure of Your Information',
    content: `
      We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>To our subsidiaries and affiliates.</li>
        <li>To contractors, service providers, and other third parties we use to support our business.</li>
        <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Frontier.cool’s assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by Frontier.cool about our Site users is among the assets transferred.</li>
        <li>To fulfill the purpose for which you provide it, such as for us to provision your use of the Services.</li>
        <li>For any other purpose disclosed by us when you provide the information.</li>
        <li>With your consent.</li>
      </ul>
      <br/>
      We may also disclose your personal information: <br/>
      <br/>
      <ul style="list-style: disc; padding-left: 32px;">
        <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request.</li>
        <li>To enforce or apply our Terms of Use, any Separate Agreement, and other agreements, including for billing and collection purposes.</li>
        <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Frontier.cool, our customers, or others.</li>
      </ul>
      <br/>
      This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.
    `,
  },
  {
    title: 'Choices About How We Use and Disclose Your Information',
    content: `
      We strive to provide you with choices regarding the personal information you provide to us. We have created mechanisms to provide you with the following control over your information:
    `,
  },
  {
    title: 'Tracking Technologies and Advertising',
    content: `
      You can set your browser to refuse all or some browser cookies or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe’s website. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly.
    `,
  },
  {
    title: 'Promotional Offers from the Company',
    content: `
      If you do not wish to have your contact information used by the Company to promote our own or third parties products or services, you can opt-out by checking the relevant box located on the form on which we collect your data or at any other time by logging into the Site and adjusting your user preferences in your account profile by checking or unchecking the relevant boxes or by sending us an email stating your request to termsofuse@Frontier.cool. If we have sent you a promotional email, you may send us a return email asking to be omitted from future email distributions. This opt-out does not apply to information provided to the Company as a result of a product purchase, warranty registration, product service experience, or other transactions. <br/>
      <br/>
      We do not control third parties' collection or use of your information to serve interest-based advertising. However, these third parties may provide you with ways to choose not to have your information collected or used in this way. You can opt-out of receiving targeted ads from members of the Network Advertising Initiative (“NAI”) on the NAI’s website.
    `,
  },
  {
    title: 'Accessing and Correcting Your Information',
    content: `
      You can review and change your personal information by logging into the Site and visiting your account profile page. If you delete your User Contributions from the Site, copies of your User Contributions may remain viewable in cached and archived pages or might have been copied or stored by other Site users. Proper access and use of information provided on the Site, including User Contributions, is governed by our Terms of Use.
    `,
  },
  {
    title: 'California Privacy Rights',
    content: `
      California Civil Code Section § 1798.83 permits users of our Site that are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please send an email to support@Frontier.cool.
    `,
  },
  {
    title: 'Data Security',
    content: `
      We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Site, you are responsible for keeping this password confidential. We ask you not to share your password with anyone. We urge you to be careful about giving out information in public areas of the Site like message boards. The information you share in public areas may be viewed by any user of the Site. <br/>
      <br/>
      Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Site. Any transmission of personal information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Site.
    `,
  },
  {
    title: 'Changes to Our Privacy Policy',
    content: `
      It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users’ personal information, we will notify you through a notice on the Site home page. The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our Site and this privacy policy to check for any changes.
    `,
  },
  {
    title: 'Contact Information',
    content: `To ask questions or comment about this privacy policy and our privacy practices, contact us at: support@Frontier.cool`,
  },
]
</script>

<style scoped>
div ul {
  list-style: disc !important;
}
</style>
