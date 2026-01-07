import css from "./OdieAvatarGen.sass?inline"
import { createElement } from "@opendaw/lib-jsx"
import { OdieModalFrame } from "./components/OdieModalFrame"
import { Button } from "@/ui/components/Button"
import { DefaultObservableValue, Terminator } from "@opendaw/lib-std"
import { Html } from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "OdieAvatarGenerator")

export const OdieAvatarGenerator = ({ onClose, onGenerated }: { onClose: () => void, onGenerated: (image: string) => void }) => {
    const lifecycle = new Terminator()
    const prompt$ = new DefaultObservableValue<string>("")
    const status$ = new DefaultObservableValue<string>("idle") // idle | generating | done
    const result$ = new DefaultObservableValue<string>("")

    const container = <div className={Html.buildClassList(className, "generator-content")}></div> as HTMLElement

    const handleGenerate = async () => {
        const prompt = prompt$.getValue().trim()
        if (!prompt || status$.getValue() === "generating") return

        status$.setValue("generating")
        render()

        // [SIMULATION] Nano Banana PRO is working...
        setTimeout(() => {
            const mockImages = [
                "https://api.dicebear.com/7.x/identicon/svg?seed=odie1",
                "https://api.dicebear.com/7.x/identicon/svg?seed=odie2",
                "https://api.dicebear.com/7.x/identicon/svg?seed=odie3"
            ]
            const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]

            result$.setValue(randomImage)
            status$.setValue("done")
            render()
        }, 2000)
    }

    const render = () => {
        container.innerHTML = ""
        const status = status$.getValue()
        const prompt = prompt$.getValue()
        const result = result$.getValue()
        const isButtonDisabled = !prompt.trim() || status === "generating"

        const fragment = document.createDocumentFragment()

        fragment.appendChild(<div className="gen-header">
            <div className="nb-tag">NANO BANANA PRO</div>
            <h3>Avatar Engine</h3>
            <p className="gen-sub">Neural Image Synthesis for your Artist Identity</p>
        </div>)

        fragment.appendChild(<div className="gen-input-area">
            <label>What should your avatar look like?</label>
            <textarea
                className="gen-textarea"
                placeholder="e.g. A cyberpunk producer in a neon studio, minimalist techno vibes, geometric abstract patterns..."
                oninput={(e: any) => prompt$.setValue(e.target.value)}
            >{prompt}</textarea>

            <div className="gen-attachment-zone">
                <div className="attach-button">+ Attach Reference Images</div>
                <div className="attach-hint">Help Nano Banana PRO understand your style better.</div>
            </div>
        </div>)

        if (status !== "idle") {
            fragment.appendChild(<div className="gen-result-area">
                {status === "generating" && (
                    <div className="gen-loading">
                        <div className="loader"></div>
                        <span>Nano Banana PRO is dreaming...</span>
                    </div>
                )}
                {status === "done" && (
                    <div className="gen-success">
                        <div className="gen-preview" style={{ backgroundImage: `url(${result})` }}></div>
                        <div className="gen-success-actions">
                            <Button
                                lifecycle={lifecycle}
                                appearance={{ framed: true, color: "blue" as any }}
                                onClick={() => onGenerated(result)}
                            >Apply to Passport</Button>
                            <Button
                                lifecycle={lifecycle}
                                appearance={{ framed: false }}
                                onClick={() => { status$.setValue("idle"); render(); }}
                            >Try Again</Button>
                        </div>
                    </div>
                )}
            </div>)
        }

        fragment.appendChild(<div className="gen-actions">
            <Button
                lifecycle={lifecycle}
                appearance={{ framed: true }}
                onClick={onClose}
            >Cancel</Button>

            <Button
                lifecycle={lifecycle}
                className={isButtonDisabled ? "disabled" : ""}
                appearance={{ framed: true, color: "blue" as any }}
                onClick={handleGenerate}
            >
                {status === "generating" ? "Synthesizing..." : "Generate Avatar"}
            </Button>
        </div>)

        container.appendChild(fragment)
    }

    render()

    return OdieModalFrame({
        title: "AI Avatar Generator",
        width: "500px",
        height: "auto",
        onClose,
        children: container
    })
}
