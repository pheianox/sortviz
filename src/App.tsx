import { Component, createEffect, createSignal, onMount, Show, untrack } from "solid-js";
import { TbRefresh, TbBolt, TbRotate2, TbPlayerSkipForward, TbSun, TbMoodBoy, TbMoon, TbEye, TbEyeOff } from 'solid-icons/tb'

enum Stage {
  Default = "Default",
  Sorting = "Sorting",
  Skipping = "Skipping"
}

enum Color {
  Primary = "!bg-primary",
  Secondary = "!bg-secondary",
  Accent = "!bg-accent",
  Error = "!bg-error",
  Success = "!bg-success",
}

const ALGORITMS = {
  'Bubble Sort': {
    complexity: 'O(n)',
    wikiLink: 'https://en.wikipedia.org/wiki/Bubble_sort',
    async run() {
      let i, j, flag, len = arrayLength()

      for (i = 0; i < len; i++) {
        flag = false

        for (j = 0; j < len - i - 1; j++) {

          isSortingStage() && mark(j, Color.Primary)
          isSortingStage() && mark(j + 1, Color.Primary)
          isSortingStage() && await pause()

          if (get(j) > get(j + 1)) {
            swap(j, j + 1)
            countSwap()
            flag = true

            isSortingStage() &&  await pause()
          }
          countComp()

          isSortingStage() &&  unmark(j, Color.Primary)
          isSortingStage() &&  unmark(j + 1, Color.Primary)
        }

        isSortingStage() &&  mark(len - 1 - i, Color.Secondary)

        if (!flag) {
          break
        }
      }
    }
  },
  'Quick Sort': {
    complexity: 'O(n•log(n))',
    wikiLink: 'https://en.wikipedia.org/wiki/Quicksort',
    async run() {
      await this.sort(0, arrayLength() - 1)
    },
    async sort(low: number, high: number) {
      if (low < high) {
        const pi = await this.part(low, high)

        await this.sort(low, pi - 1)
        await this.sort(pi + 1, high)
      }
    },
    async part(low: number, high: number) {
      const pivot = get(high)
      let i = low - 1

      isSortingStage() && await pause()
      isSortingStage() && mark(high, Color.Primary)


      for (let j = low; j <= high - 1; j++) {
        isSortingStage() && mark(j, Color.Accent)
        isSortingStage() && await pause()
        isSortingStage() && unmark(j, Color.Accent)

        if (get(j) < pivot) {
          i++
          swap(i, j)
          countSwap()
        }
        countComp()
      }

      isSortingStage() && unmark(high, Color.Primary)
      isSortingStage() && await pause()

      i++

      swap(i, high)
      countSwap()

      return i
    }
  },
  'Comb Sort': {
    complexity: 'O(n²)',
    wikiLink: 'https://en.wikipedia.org/wiki/Comb_sort',
    async run() {
      let len = arrayLength(), gap = len, flag, i

      do {
        isSortingStage() && await pause()

        flag = false
        gap = await this.next(gap)

        for (i = 0; i < len - gap; i++) {
          isSortingStage() && forEach(i, i + gap, x => mark(x, Color.Accent))
          isSortingStage() && await pause()
          

          if (get(i) > get(i + gap)) {
            isSortingStage() && unmark(i)
            isSortingStage() && unmark(i + gap)
            isSortingStage() && mark(i, Color.Primary)
            isSortingStage() && mark(i + gap, Color.Primary)
            isSortingStage() && await pause()
            
            swap(i, i + gap)
            countSwap()
            flag = true
            
            isSortingStage() && await pause()
            isSortingStage() && unmark(i, Color.Primary)
            isSortingStage() && unmark(i + gap, Color.Primary)

          }
          countComp()

          isSortingStage() && await pause()
          isSortingStage() && forEach(i, i + gap, x => unmark(x, Color.Accent))
        }
      } while (gap != 1 || flag);
    },
    async next(gap: number) {
      gap = Math.floor(gap * 10 / 13)
      if (gap < 1) {
        return 1;
      }
      return gap
    }
  },
  'Insertion Sort': {
    complexity: 'O(n)',
    wikiLink: 'https://en.wikipedia.org/wiki/Insertion_sort',
    async run() {
      let i, j, tmp, len = arrayLength()

      for (i = 1; i < len; i++) {
        tmp = get(i)
        j = i - 1

        isSortingStage() && mark(i, Color.Accent)
        isSortingStage() && await pause() 
        isSortingStage() && unmark(i, Color.Accent)

        while (j >= 0 && get(j) > tmp) {
          countComp()

          isSortingStage() && mark(j + 1, Color.Primary)
          isSortingStage() && await pause() 
          isSortingStage() && unmark(j + 1, Color.Primary)

          swap(j, j + 1)
          countSwap()
          j = j - 1;
        }

        set(j + 1, tmp)
      }
    }
  },
  'Selection Sort': {
    complexity: 'O(n²)',
    wikiLink: 'https://en.wikipedia.org/wiki/Selection_sort',
    async run() {
      let i = -1, j = -1, min = -1, len = arrayLength()

      for (i = 0; i < len - 1; i++) {
        min = i

        isSortingStage() && await pause()
        isSortingStage() && mark(min, Color.Primary)
        isSortingStage() && await pause()

        for (j = i + 1; j < len; j++) {

          isSortingStage()  && mark(j, Color.Accent)
          isSortingStage()  && await pause()
          isSortingStage()  && unmark(j, Color.Accent)

          if (get(j) < get(min)) {

            isSortingStage() && unmark(min, Color.Primary)
            isSortingStage() && await pause()

            min = j

            isSortingStage() && mark(min, Color.Primary)
          }
          countComp()

        }

        swap(min, i)
        countSwap()

        isSortingStage() && unmark(min, Color.Primary)
        isSortingStage() && unmark(i, Color.Primary)
        isSortingStage() && mark(i, Color.Secondary)
      }
    }
  },
  'Shell Sort': {
    complexity: 'O((n•log(n))²)',
    wikiLink: 'https://en.wikipedia.org/wiki/Shellsort',
    async run() {
      let i = -1, j = -1, tmp = -1, gap = -1, len = arrayLength()

      for (gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
        
        for (i = gap; i < len; i++) {
          isSortingStage() && await pause()

          tmp = get(i)

          for (j = i; j >= gap && get(j - gap) > tmp; j -= gap) {
            countComp()

            isSortingStage() && forEach(j - gap, j, x => mark(x, Color.Accent))
            isSortingStage() && await pause()

            isSortingStage() && unmark(j, Color.Accent)
            isSortingStage() && unmark(j - gap, Color.Accent)

            isSortingStage() && mark(j, Color.Primary)
            isSortingStage() && mark(j - gap, Color.Primary)

            isSortingStage() && await pause()
            
            swap(j, j - gap)
            countSwap()

            isSortingStage() && await pause()

            isSortingStage() && unmark(j, Color.Primary)
            isSortingStage() && unmark(j - gap, Color.Primary)

            isSortingStage() && await pause()
            isSortingStage() && forEach(j - gap, j, x => unmark(x, Color.Accent))
          }

          set(j, tmp)
        }
      }
    }
  },
  'Cocktail Sort': {
    complexity: 'O(n²)',
    wikiLink: 'https://en.wikipedia.org/wiki/Cocktail_shaker_sort',
    async run() {
      let i = -1, j = -1, start = 0, end = arrayLength(), flag = true

      while (flag === true) {
        flag = false

        for (i = start; i < end - 1; i++) {
          isSortingStage() && mark(i, Color.Primary)
          isSortingStage() && mark(i + 1, Color.Primary)
          isSortingStage() && await pause()

          if (get(i) > get(i + 1)) {
            swap(i, i + 1)
            countSwap()
            flag = true
            isSortingStage() && await pause()
          }
          countComp()

          isSortingStage() &&  unmark(i, Color.Primary)
          isSortingStage() &&  unmark(i + 1, Color.Primary)
        }

        isSortingStage() &&  mark(end - 1, Color.Secondary)

        if (!flag) {
          break
        }

        flag = false
        end--

        for (i = end - 1; i >= start; i--) {
          isSortingStage() && mark(i, Color.Primary)
          isSortingStage() && mark(i + 1, Color.Primary)
          isSortingStage() && await pause()

          if (get(i) > get(i + 1)) {
            swap(i, i + 1)
            countSwap()
            flag = true
            isSortingStage() && await pause()
          }
          countComp()

          isSortingStage() &&  unmark(i, Color.Primary)
          isSortingStage() &&  unmark(i + 1, Color.Primary)
        }
        
        isSortingStage() &&  mark(start, Color.Secondary)
        start++
      }
    }
  }
}

const TRANSITION_MAX_MS = 500

const MIN_ARRAY_LENGTH = 2
const MAX_ARRAY_LENGTH = 100
const ARRAY_LENGTH_STEP = 1

const MIN_SORTING_SPEED = 1
const MAX_SORTING_SPEED = TRANSITION_MAX_MS + 1
const SORTING_SPEED_STEP = TRANSITION_MAX_MS / 4

const CONTAINER_WIDTH_VMAX = 90
const CONTAINER_GAP_VMAX = 0.5


const [stage, setStage] = createSignal(Stage.Default)
const isSortingStage = () => stage() !== Stage.Skipping
const [isRestorable, setUnsortable] = createSignal(false)

const [sortingSpeed, setSortingSpeed] = createSignal(SORTING_SPEED_STEP * 2 + 1)
const [sortingAlgoritm, setSortingAlgoritm] = createSignal<keyof typeof ALGORITMS>("Quick Sort")
const transitionMilliseconds = () => Math.floor(TRANSITION_MAX_MS - sortingSpeed()) + 1
const [counters, setCounters] = createSignal({ swaps: 0, comps: 0 })

const [arrayLength, setArrayLength] = createSignal(25)
const [array, setArray] = createSignal([] as HTMLSpanElement[])
const [arrayValueBackup, setArrayValueBackup] = createSignal([] as number[])

const [isDarkModeEnabled, setDarkModeEnabled] = createSignal(false)
const [isAnimationsEnabled, setAnimationsEnabled] = createSignal(true)

const setArrayLengthText = (value: string) => arrayLengthTextRef.textContent = value
const setSortingSpeedText = (value: string) => sortingSpeedTextRef.textContent = value

const setArrayLengthTextDebounced = debounce(setArrayLengthText, 1000)
const setSortingSpeedTextDebounced = debounce(setSortingSpeedText, 1000)

let elementsParentRef = null as unknown as HTMLDivElement
let sortingSpeedTextRef = null as unknown as HTMLLabelElement
let arrayLengthTextRef = null as unknown as HTMLLabelElement
let skipElementRef = null as unknown as HTMLDivElement

const [isRunAnyways, setRunAnyways] = createSignal(false)

function swap(i: number, j: number) {
  setArray(arr => {
    ;[arr[i].style.transform, arr[j].style.transform] = 
    [arr[j].style.transform, arr[i].style.transform]
    ;[arr[i], arr[j]] = 
    [arr[j], arr[i]]
    return arr
  })
}

function get(i: number) {
  return Number(array()[i].dataset.value)
}

function set(i: number, value: number) {
  setArray(arr => {
    arr[i].dataset.value = value.toString()
    return arr
  })
}

function mark(i: number, color: Color) {
  array()[i].classList.add(color)
}

function unmark(i: number, color?: Color) {
  if (color) array()[i].classList.remove(color)
  else array()[i].classList.remove(...Object.values(Color))
}

function forEach(low: number, high: number, callback: (i: number) => any) {
  for (let i = low; i <= high; i++) {
    callback(i)
  }
}

function countSwap() {
  setCounters(stat => ({ ...stat, swaps: stat.swaps + 1}))
}

function countComp() {
  setCounters(stat => ({ ...stat, comps: stat.comps + 1}))
}

function resetCounters() {
  setCounters({ swaps: 0, comps: 0 })
}

function markAllDone() {
  forEach(0, arrayLength() - 1, i => mark(i, Color.Success))
}

function unmarkAll() {
  forEach(0, arrayLength() - 1, i => unmark(i))
}

async function pause() {
  return new Promise(resolve => setTimeout(resolve, transitionMilliseconds()))
}

function shuffle<T>(arr: T[]): T[] {
  let i = arr.length,  ri;
  while (i != 0) {
    ri = Math.floor(Math.random() * i)
    i--
    ;[arr[i], arr[ri]] = [
      arr[ri], arr[i]];
  }
  return arr;
}

function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  return (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  }
}

function createArray(valueArray: number[]) {
  const arrayLength = valueArray.length
  const arrayMaxValue = Math.max(...valueArray)

  return valueArray.map((value, offset) => {
    const totalGapCount = arrayLength - 1
    const availableSpaceVmax = CONTAINER_WIDTH_VMAX - CONTAINER_GAP_VMAX * totalGapCount
    const elementWidthVmax = availableSpaceVmax / arrayLength
    const elementHeightRatio = 100 / arrayMaxValue 

    const elemen = <span 
      style={{ 
        'height': `${value * elementHeightRatio}%`, 
        'width': `${elementWidthVmax}vmax`, 
        'transform': `translateX(${(elementWidthVmax + CONTAINER_GAP_VMAX) * offset}vmax)`
      }} 
      data-value={value} 
      class={"absolute bottom-0 block rounded-lg bg-red-100"} 
    />

    return elemen
  }) as HTMLSpanElement[]
}

function regenerate() {
  const randomArray = shuffle(Array(arrayLength()).fill(0).map((_, i) => i + 1))
  setArray(createArray(randomArray))
  setArrayValueBackup(randomArray)
  setUnsortable(false)
  resetCounters()
}

function restore() {
  const backupValues = arrayValueBackup()
  setArray(createArray(backupValues))
  setUnsortable(false)
  resetCounters()
}

function skip() {
  unmarkAll()
  setStage(Stage.Skipping)
}

async function sort() {
  unmarkAll()
  resetCounters()
  setStage(Stage.Sorting)
  await ALGORITMS[sortingAlgoritm()].run()
  setStage(Stage.Default)
  markAllDone()
  setUnsortable(true)
}

function readSortingSpeed(value: number) {
  switch (value - 1) {
    case SORTING_SPEED_STEP * 0: return 'Super Slow'
    case SORTING_SPEED_STEP * 1: return 'Slower'
    case SORTING_SPEED_STEP * 2: return 'Medium'
    case SORTING_SPEED_STEP * 3: return 'Faster'
    case SORTING_SPEED_STEP * 4: return 'Super Fast'
    default: return '-'
  }
}

function detectMobile() {
  let check = false;
  // @ts-ignore
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function init() {
  createEffect(() => {
    regenerate()
    setArrayLengthText(arrayLength().toString())
    setArrayLengthTextDebounced("Data Size")
  })
  createEffect(() => {
    const isTurnOn = isAnimationsEnabled()

    if (skipElementRef) {
      skipElementRef.style.transition = isTurnOn ? 'all 1.5s' : 'none'
    }
    const transition = isTurnOn ? `all ${transitionMilliseconds()}ms` : 'none'
    const elements = array()
    for (const element of elements) {
      element.style.transition = transition
    }
  })
  createEffect(() => {
    setSortingSpeedText(readSortingSpeed(sortingSpeed()))
    setSortingSpeedTextDebounced("Sorting Speed")
  })
}

const Toolbar: Component = () => {

  createEffect(() => {
    document.documentElement.dataset.theme = isDarkModeEnabled() ? 'dark' : 'light'
  })

  return (
    <div class="navbar shadow-lg bg-base-200 p-4 items-center flex-wrap">
        <div class="flex-1 gap-8 p-4">
          <a class="btn btn-ghost" href="https://github.com/pheianox/sortviz" target="_blank">
            <svg class="w-20"  viewBox="0 0 330 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30.0243 44.5017L13.5538 40.6008C9.00277 39.5172 5.7159 37.6752 3.69321 35.0746C1.67052 32.4017 0.65918 28.7175 0.65918 24.022C0.65918 17.1593 2.60963 12.1026 6.51053 8.85184C10.4837 5.60108 16.624 3.97571 24.9315 3.97571C28.3989 3.97571 31.5052 4.15631 34.2503 4.5175C37.0676 4.80646 39.6682 5.27601 42.0521 5.92616V14.2697C39.018 13.5474 36.1285 13.0417 33.3834 12.7527C30.6383 12.4638 27.7849 12.3193 24.8231 12.3193C19.2607 12.3193 15.3598 13.15 13.1204 14.8115C10.881 16.4008 9.76128 19.2542 9.76128 23.3719C9.76128 25.9725 10.267 27.959 11.2783 29.3316C12.3619 30.6319 14.0956 31.571 16.4795 32.1489L32.8416 36.0498C38.6207 37.4223 42.4494 39.3728 44.3276 41.9011C46.278 44.3573 47.2533 48.1859 47.2533 53.3871C47.2533 60.8277 45.3028 66.1012 41.4019 69.2074C37.5733 72.3137 31.4691 73.8668 23.0894 73.8668C18.6828 73.8668 14.4207 73.5779 10.3031 73C6.25769 72.4221 3.04306 71.6636 0.65918 70.7244V62.0558C4.05441 63.0671 7.66635 63.8618 11.495 64.4397C15.3237 64.9453 19.1885 65.1982 23.0894 65.1982C28.5073 65.1982 32.2998 64.4035 34.467 62.8143C36.6342 61.225 37.7177 58.1549 37.7177 53.6038C37.7177 50.7865 37.1759 48.7638 36.0924 47.5358C35.081 46.2355 33.0583 45.2241 30.0243 44.5017Z" fill="black"/>
              <path d="M207.625 64.6564V72.1331C206.469 72.6388 204.88 73.0361 202.857 73.3251C200.906 73.6863 199.028 73.8669 197.222 73.8669C190.721 73.8669 186.061 72.4221 183.244 69.5325C180.499 66.643 179.126 61.6585 179.126 54.5791V27.0561H171.108V19.471H179.235L180.643 6.46799H188.012V19.471H207.083V27.0561H188.012V54.254C188.012 58.6606 188.806 61.6585 190.396 63.2478C192.057 64.837 194.947 65.6316 199.064 65.6316C200.365 65.6316 201.846 65.5233 203.507 65.3066C205.241 65.0899 206.613 64.8731 207.625 64.6564Z" fill="black"/>
              <path d="M251.953 19.471H261.706L241.118 73H230.932L210.344 19.471H220.204L236.133 64.8731L251.953 19.471Z" fill="black"/>
              <path d="M279.167 10.1522H269.631V0.941711H279.167V10.1522ZM278.842 73H269.956V19.471H278.842V73Z" fill="black"/>
              <path d="M329.322 65.1982V73H289.121V65.1982L317.403 27.0561H291.072V19.471H327.48V27.0561L299.198 65.1982H329.322Z" fill="black"/>
              <path d="M142.885 73H134V19.471H142.127L142.56 24.022H142.994C145.811 22.3605 148.628 21.1325 151.446 20.3378C154.263 19.471 157.044 19.0375 159.789 19.0375C160.945 19.0375 161.704 19.0375 162.065 19.0375C162.498 19.0375 162.823 19.0737 163.04 19.1459V27.7062C162.534 27.5617 161.884 27.4895 161.09 27.4895C160.367 27.4172 159.211 27.3811 157.622 27.3811C155.022 27.3811 152.457 27.7062 149.929 28.3564C147.473 28.9343 145.125 29.8373 142.885 31.0653V73Z" fill="black"/>
              <path d="M99 29.625L108.625 20L118.25 29.625" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M79.4375 20H66.6042C65.7182 20 65 20.7182 65 21.6042V34.4375C65 35.3235 65.7182 36.0417 66.6042 36.0417H79.4375C80.3235 36.0417 81.0417 35.3235 81.0417 34.4375V21.6042C81.0417 20.7182 80.3235 20 79.4375 20Z" stroke="black" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M79.4375 53.875H66.6042C65.7182 53.875 65 54.5932 65 55.4792V68.3125C65 69.1985 65.7182 69.9167 66.6042 69.9167H79.4375C80.3235 69.9167 81.0417 69.1985 81.0417 68.3125V55.4792C81.0417 54.5932 80.3235 53.875 79.4375 53.875Z" stroke="black" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M109 26L109 70" stroke="black" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

        <div class="flex gap-8 p-4">

          {/* Sorting Speed */}
          <div class="flex flex-col gap-3">
            <label class="text-xs text-center" ref={sortingSpeedTextRef}>
              Sorting Speed
            </label>
            <input 
              oninput={event => setSortingSpeed(+event.currentTarget.value)}
              value={sortingSpeed()} min={MIN_SORTING_SPEED} max={MAX_SORTING_SPEED} step={SORTING_SPEED_STEP} 
              type="range" class="range range-xs range-primary w-42" 
            />
          </div>

          {/* Array Length */}
          <div class="flex flex-col gap-3" classList={{ 'opacity-50 pointer-events-none' : stage() === Stage.Sorting}}>
            <label class="text-xs text-center" ref={arrayLengthTextRef}>Data Size</label>
            <input 
              oninput={event => setArrayLength(+event.currentTarget.value)}
              value={arrayLength()} min={MIN_ARRAY_LENGTH} max={MAX_ARRAY_LENGTH} step={ARRAY_LENGTH_STEP} 
              type="range" class="range range-xs range-primary w-42" 
            />
          </div>

          <div 
            class="flex gap-8" 
            classList={{ 'opacity-50 pointer-events-none': stage() === Stage.Sorting }}
          >
            {/* Regenerate Button */}
            <div class="tooltip tooltip-bottom" data-tip="Regenerate">
              <button onclick={regenerate} class="btn btn-ghost btn-primary gap-3" >
                <TbRefresh class="w-5 h-5 stroke" />
              </button>
            </div>

            {/* Restore Button */}
            <div class="tooltip tooltip-bottom" data-tip="Restore" classList={{ 'opacity-30 pointer-events-none': !(isRestorable() || stage() == Stage.Sorting)}}>
              <button onclick={restore} class="btn btn-ghost btn-primary gap-3">
                <TbRotate2 class="w-5 h-5 stroke" />
              </button>
            </div>

            {/* Algoritm */}
            <select 
              onchange={event => setSortingAlgoritm(event.currentTarget.value as keyof typeof ALGORITMS)} 
              class="select select-bordered">
              {Object.keys(ALGORITMS).map((algoritm) => (
                <option value={algoritm} selected={algoritm === sortingAlgoritm()}>{algoritm}</option>
              ))}
            </select>
         </div>
        </div>
        <div class="flex-1 gap-8 p-4 justify-between">
          {/* Sort/Skip  */}
          {stage() === Stage.Sorting 
            ? (
              <button onclick={skip} class="btn btn-primary gap-2">
                <TbPlayerSkipForward class="w-5 h-5 stroke"/>
                Skip
              </button>
            ) : (
              <button onclick={sort} class="btn btn-primary gap-2">
                <TbBolt class="w-5 h-5 stroke"/>
                Sort
              </button>
            )
          }

          <div class="flex gap-8">
            {/* Animations */}
            <div class="tooltip tooltip-bottom" data-tip={`Animations (${isAnimationsEnabled() ? 'on' : 'off'})`}>
              <label class="btn btn-ghost swap swap-rotate">
                <input type="checkbox" checked={isAnimationsEnabled()} onchange={event => setAnimationsEnabled(event.currentTarget.checked)}/>
                <TbEye class="swap-on w-6 h-6" />
                <TbEyeOff class="swap-off w-6 h-6" />
              </label>
            </div>

            {/* Dark Mode */}
            <div class="tooltip tooltip-bottom" data-tip={`Dark Mode (${isDarkModeEnabled() ? 'on' : 'off'})`}>
              <label class="btn btn-ghost swap swap-rotate">
                <input type="checkbox" checked={isDarkModeEnabled()} onchange={event => setDarkModeEnabled(event.currentTarget.checked)}/>
                <TbSun class="swap-off w-6 h-6" />
                <TbMoon class="swap-on w-6 h-6" />
              </label>
            </div>
          </div>
        </div>
      </div>
  )
}

const Container: Component = () => {
  return (
    <div class="flex-1 bg-base-100 flex flex-col justify-between relative p-[5vmax]">

      <div class="place-self-start flex flex-col gap-10">
        <a class="text-5xl font-bold link link-hover" target="_blank" href={ALGORITMS[sortingAlgoritm()].wikiLink}>{sortingAlgoritm()}</a>
        <div class="flex gap-5">
          <p class="flex gap-2">DATA SIZE: <span class="text-primary">{arrayLength()}</span></p>
          <p class="flex gap-2">SWAPS: <span class="text-primary">{counters().swaps}</span></p>
          <p class="flex gap-2">COMPARISONS: <span class="text-primary">{counters().comps}</span></p>
        </div>
      </div>

      <div  
        ref={elementsParentRef} 
        class={`relative h-[300px]`}
        style={{ 'width': `${CONTAINER_WIDTH_VMAX}vmax`}}
      >
        {array()}
      </div>

      <div ref={skipElementRef} class={`absolute top-0 left-0 bottom-0 right-0 bg-base-100 grid place-items-center ${stage() === Stage.Skipping ? 'opacity-100': 'opacity-0 pointer-events-none'}`}>
        <div>
          Skipping sorting...
        </div>
      </div>
    </div>
  )
}

const Application: Component = () => {
  onMount(init)
  return (
    <div class="select-none h-screen flex flex-col overflow-hidden"> 
        <Toolbar />
        <Container />
    </div>
  )
}

const NoMobileSupport: Component = () => {
  return (
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md flex flex-col gap-5">
          <h1 class="text-5xl font-bold">Use PC</h1>
          <p class="py-6">Mobile experience is limited</p>
          <button class="btn btn-primary btn-sm" onclick={() => setRunAnyways(true)}>Run anyways</button>
        </div>
      </div>
    </div>
  )
}

export default () => {
  const isMobile = detectMobile()
  return <>
    <Show when={!isMobile || isRunAnyways()} fallback={<NoMobileSupport />}><Application /></Show>
  </>
}