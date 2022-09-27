import { VALUE_ADDED_SERVICE_ID } from '@/utils/constants'
import i18n from '@/utils/i18n'
import Made2FlowLogo from "@/assets/images/Made2Flow_logo.png"
import Made2FlowBanner from "@/assets/images/Made2Flow_banner.jpg"
import Made2FlowPrice from "@/assets/images/Made2Flow_price.png"

const t = i18n.global.t

export default [
  {
    id: VALUE_ADDED_SERVICE_ID.MADE2FLOW,
    logo: Made2FlowLogo,
    // logo 需使用 2x 解析度才會夠（程式中會自動縮小0.5）
    providerName: t('M2F040'),
    projectName: t('M2F031'),
    bannerImage: Made2FlowBanner,
    description: t('M2F032'),
    detail: {
      faqList: [
        {
          title: t("M2F001"),
          answer: t("M2F002"),
        },
        {
          title: t("M2F003"),
          answer: t("M2F004"),
        },
        {
          title: t("M2F005"),
          answer: t("M2F006"),
        },
        {
          title: t("M2F007"),
          answer: t("M2F008"),
        },
        {
          title: t("M2F009"),
          answer: t("M2F010"),
        },
        {
          title: t("M2F011"),
          answer: t("M2F012"),
        },
        {
          title: t("M2F013"),
          answer: t("M2F014"),
        },
        {
          title: t("M2F015"),
          answer: t("M2F016"),
        },
        {
          title: t("M2F017"),
          answer: t("M2F018"),
        },
        {
          title: t("M2F019"),
          answer: t("M2F020"),
        },
        {
          title: t("M2F021"),
          answer: t("M2F022"),
        },
        {
          title: t("M2F023"),
          answer: t("M2F024"),
        },
        {
          title: t("M2F025"),
          answer: t("M2F026"),
        },
        {
          title: t("M2F027"),
          answer: t("M2F028"),
        },
        {
          title: t("M2F029"),
          answer: t("M2F030"),
        }
      ],
      planAndPrice: Made2FlowPrice
    }
  }
]
