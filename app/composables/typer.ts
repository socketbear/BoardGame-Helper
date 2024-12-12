interface TyperProgress {
  word: number
  char: number
  building: boolean
  looped: number
}

interface CursorInstance {
  element: HTMLElement
  on: boolean
  interval: NodeJS.Timeout
  owner?: Typer
  updateBlinkState: () => void
  destroy: () => void
}

class Typer {
  private element: HTMLElement
  private words: string[]
  private delayVariance: number
  private delay: number
  private loop: number | string
  private deleteDelay: number
  private progress: TyperProgress
  private typing: boolean
  private colors: string[]
  private colorIndex: number
  public cursor?: CursorInstance

  constructor(element: HTMLElement) {
    this.element = element
    const delim = element.dataset.delim || ','
    const words = element.dataset.words || 'override these,sample typing'
    this.words = words.split(delim).filter(v => v)
    this.delayVariance = Number.parseInt(element.dataset.delayVariance || '0')
    this.delay = Number.parseInt(element.dataset.delay || '200')
    this.loop = element.dataset.loop || 'true'
    if (this.loop === 'false') { this.loop = 1 }
    this.deleteDelay = Number.parseInt(element.dataset.deletedelay || element.dataset.deleteDelay || '800')

    this.progress = { word: 0, char: 0, building: true, looped: 0 }
    this.typing = true

    const colors = element.dataset.colors
    this.colors = []
    this.colorIndex = 0
    if (colors) {
      this.colors = colors.split(',')
      this.element.style.color = this.colors[0] as string
    }

    this.doTyping()
  }

  public start(): void {
    if (!this.typing) {
      this.typing = true
      this.doTyping()
    }
  }

  public stop(): void {
    this.typing = false
  }

  private doTyping(): void {
    const e = this.element
    const p = this.progress
    const w = p.word
    const c = p.char
    const word = this.words[w] || ''
    const currentDisplay = [...word].slice(0, c).join('')
    let atWordEnd = false
    const timeoutDelay = ((2 * Math.random() - 1) * this.delayVariance) + this.delay

    if (this.cursor) {
      this.cursor.element.style.opacity = '1'
      this.cursor.on = true
      if (this.cursor.interval) {
        clearInterval(this.cursor.interval)
      }
      this.cursor.interval = setInterval(() => this.cursor!.updateBlinkState(), 400)
    }

    e.innerHTML = currentDisplay

    if (p.building) {
      atWordEnd = p.char === word.length
      if (atWordEnd) {
        p.building = false
      }
      else {
        p.char += 1
      }
    }
    else {
      if (p.char === 0) {
        p.building = true
        p.word = (p.word + 1) % this.words.length
        if (this.colors.length > 0) {
          this.colorIndex = (this.colorIndex + 1) % this.colors.length
          this.element.style.color = this.colors[this.colorIndex] as string
        }
      }
      else {
        p.char -= 1
      }
    }

    if (p.word === this.words.length - 1) {
      p.looped += 1
    }

    if (!p.building && (this.loop as number) <= p.looped) {
      this.typing = false
    }

    setTimeout(() => {
      if (this.typing) { this.doTyping() };
    }, atWordEnd ? this.deleteDelay : timeoutDelay)
  }

  public destroy(): void {
    this.typing = false
    if (this.cursor) {
      clearInterval(this.cursor.interval)
      this.cursor.destroy()
      this.cursor = undefined
    }
  }
}

class Cursor {
  public element: HTMLElement
  public on: boolean
  public interval: NodeJS.Timeout
  public owner?: Typer
  private cursorDisplay: string

  constructor(element: HTMLElement) {
    this.element = element
    this.cursorDisplay = element.dataset.cursordisplay || element.dataset.cursorDisplay || '_'
    this.element.innerHTML = this.cursorDisplay
    this.on = true
    this.element.style.transition = 'all 0.1s'
    this.interval = setInterval(() => this.updateBlinkState(), 400)
  }

  public updateBlinkState(): void {
    if (this.on) {
      this.element.style.opacity = '0'
      this.on = false
    }
    else {
      this.element.style.opacity = '1'
      this.on = true
    }
  }

  public destroy(): void {
    clearInterval(this.interval)
    this.element.remove()
    this.owner = undefined
  }
}

export function TyperSetup(): { destroy: () => void } {
  const typers: { [key: string]: Typer } = {}

  for (const e of document.getElementsByClassName('typer')) {
    typers[e.id] = new Typer(e as HTMLElement)
  }

  for (const e of document.getElementsByClassName('typer-stop')) {
    const owner = typers[(e as HTMLElement).dataset.owner || '']
    if (owner) {
      (e as HTMLElement).onclick = () => owner.stop()
    }
  }

  for (const e of document.getElementsByClassName('typer-start')) {
    const owner = typers[(e as HTMLElement).dataset.owner || '']
    if (owner) {
      (e as HTMLElement).onclick = () => owner.start()
    }
  }

  for (const e of document.getElementsByClassName('cursor')) {
    const t = new Cursor(e as HTMLElement)
    const owner = typers[(e as HTMLElement).dataset.owner || '']
    if (owner) {
      t.owner = owner
      owner.cursor = t
    }
  }

  return {
    destroy: () => {
      Object.values(typers).forEach(typer => typer.destroy())
    },
  }
}
