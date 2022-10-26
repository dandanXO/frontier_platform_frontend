import { VALUE_ADDED_SERVICE_ID } from '@/utils/constants'
import i18n from '@/utils/i18n'
import Made2FlowLogo from "@/assets/images/Made2Flow_logo.png"
import Made2FlowBannerCh from "@/assets/images/Made2Flow_banner_ch.jpg"
import Made2FlowBannerEn from "@/assets/images/Made2Flow_banner_en.jpg"
import Made2FlowPriceCh from "@/assets/images/Made2Flow_price_ch.jpg"
import Made2FlowPriceEn from "@/assets/images/Made2Flow_price_en.jpg"
import Made2FlowSlide1Ch from '@/assets/images/Made2Flow_slide_1_ch.jpg'
import Made2FlowSlide1En from '@/assets/images/Made2Flow_slide_1_en.jpg'
import Made2FlowSlide2Ch from '@/assets/images/Made2Flow_slide_2_ch.jpg'
import Made2FlowSlide2En from '@/assets/images/Made2Flow_slide_2_en.jpg'
import Made2FlowSlide3Ch from '@/assets/images/Made2Flow_slide_3_ch.jpg'
import Made2FlowSlide3En from '@/assets/images/Made2Flow_slide_3_en.jpg'



const t = i18n.global.t

export default function valueAddedServiceList () {
  const locale = i18n.global.locale.value
  return [
    {
      id: VALUE_ADDED_SERVICE_ID.MADE2FLOW,
      logo: Made2FlowLogo,
      // logo 需使用 2x 解析度才會夠（程式中會自動縮小0.5）
      providerName: t('M2F040'),
      projectName: t('M2F031'),
      bannerImage: locale === 'en-US' ? Made2FlowBannerEn : Made2FlowBannerCh,
      description: t('M2F032'),
      detail: {
        slideImage: locale === 'en-US' ? [Made2FlowSlide1En, Made2FlowSlide2En, Made2FlowSlide3En] : [Made2FlowSlide1Ch, Made2FlowSlide2Ch, Made2FlowSlide3Ch],
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
        planAndPrice: locale === 'en-US' ? Made2FlowPriceEn : Made2FlowPriceCh
      }
    }
  ]
}
