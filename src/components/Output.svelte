<script>
    export let output
    import { DOCS_REFERENCES } from "src/docs";
</script>

<div class="output">
    <div class="icon">
      {#if output.data}
        {#if output.status === "error"}
          <svg class="error" xmlns="http://www.w3.org/2000/svg" width="4.066" height="4.066" viewBox="0 0 4.066 4.066">
            <path id="Icon_material-error-outline" data-name="Icon material-error-outline" d="M4.83,5.643h.407v.407H4.83Zm0-1.626h.407v1.22H4.83ZM5.031,3A2.033,2.033,0,1,0,7.066,5.033,2.032,2.032,0,0,0,5.031,3Zm0,3.659A1.626,1.626,0,1,1,6.659,5.033,1.626,1.626,0,0,1,5.033,6.659Z" transform="translate(-3 -3)"/>
          </svg>
          <span>Error ({output.method})
            [<!--
            -->{#if DOCS_REFERENCES[output.method]}
              <a target="_blank" href={DOCS_REFERENCES[output.method]}>method ref.</a>,
              {/if}<!-- 
              --><a target="_blank" href={DOCS_REFERENCES.errors}>error ref.</a><!--
            -->]
          </span>
        {:else}
          <svg class="success" xmlns="http://www.w3.org/2000/svg" width="4.166" height="4.166" viewBox="0 0 4.166 4.166">
            <g id="Icon_ionic-ios-checkmark-circle-outline" data-name="Icon ionic-ios-checkmark-circle-outline" transform="translate(-3.325 -3.325)">
              <path id="Path_1" data-name="Path 1" d="M12.528,12.395l-.172-.177a.037.037,0,0,0-.027-.012h0a.035.035,0,0,0-.027.012l-1.192,1.2-.434-.434a.038.038,0,0,0-.055,0l-.174.174a.039.039,0,0,0,0,.056l.547.547a.173.173,0,0,0,.114.056.181.181,0,0,0,.113-.054h0l1.307-1.314A.042.042,0,0,0,12.528,12.395Z" transform="translate(-6.078 -7.604)" stroke="currentColor" stroke-width="0.1"/>
              <path id="Path_2" data-name="Path 2" d="M5.408,3.649a1.759,1.759,0,1,1-1.244.515,1.748,1.748,0,0,1,1.244-.515m0-.274A2.033,2.033,0,1,0,7.441,5.408,2.033,2.033,0,0,0,5.408,3.375Z" transform="translate(0 0)" stroke="currentColor" stroke-width="0.1"/>
            </g>
          </svg>
          <span>Success! ({output.method})</span>
        {/if}
      {:else}
        <span>Output:</span>
      {/if}
    </div>
    <pre><code>{output.data && JSON.stringify(output.data || "", null, 4) || ""}</code></pre>
</div>

<style>
    .output * {
        font-family: monospace !important
    }

    .output {
        background: #f0f0f0;
        padding: .75rem;
        overflow: auto;
    }

    .icon {
        display: flex;
        align-items: center;
        margin-bottom: .5rem
    }

    .icon svg {
        height: 1em;
        width: 1em;
        fill: currentColor;
        outline: currentColor;
        margin-right: .25em
    }

    .icon svg.success {
        color: rgb(24, 122, 68)
    }

    .icon svg.error {
        color: rgb(202, 28, 28)
    }
</style>