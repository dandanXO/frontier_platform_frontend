import FTable from './FTable.vue'

export default {
  title: 'FTable',
  component: FTable,
  args: {
    headers: [
      {
        prop: 'header1',
        label: 'header 1',
        colSpan: 'col-span-2',
      },
      {
        prop: 'header2',
        label: 'header 2',
        colSpan: 'col-span-2',
      },
      {
        prop: 'header3',
        label: 'header 3',
        colSpan: 'col-span-2',
      },
      {
        prop: 'header4',
        label: 'header 4',
        colSpan: 'col-span-2',
      },
      {
        prop: 'header5',
        label: 'header 5',
        colSpan: 'col-span-2',
      },
      {
        prop: 'header6',
        label: 'header 6',
        colSpan: 'col-span-2',
      },
    ],
    items: new Array(10).fill(0).map(() => ({
      header1: 'item1',
      header2: 'item2',
      header3: 'item3',
      header4: 'item4',
      header5: 'item5',
      header6: 'item6',
    })),
  },
}

export const Default = (args) => ({
  components: { FTable },
  setup() {
    return { args }
  },
  template: `
    <f-table v-bind="args">
    </f-table>
    `,
})
