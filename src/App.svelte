<script>
  /**
   * Planned changes
   * - modify field definition, make it more readable and sane
   * - allow for network specific options, fields
   * - introduce value parsers
   * - make element generation more generic, allow for other new types
   * - enable children (transfer, batchTransferNFT), child elements
   * - introduce field dependency (required if one of is selected)
  */

  import { Link } from '@imtbl/imx-sdk';
  import { get_fields } from './fields'
  import Input from './components/Input.svelte';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import Fields from './components/Fields.svelte';
  // import { tick } from 'svelte';
  hljs.registerLanguage('javascript', javascript);

  let network = "sandbox"
  let payload
  let method
  let fields

  $: method ? fields = get_fields(method) : fields = {}
  
  // const checkMethodAvailable = async select => {
  //   if(!select) return
  //   await tick()
  //   if(select.value !== method) method = select.value
  // }

  // $: payload, payload = Object.fromEntries(Object.entries(payload).filter( ([_, v]) => v )), highlightCode()
  // $: fields, constructPayload(), highlightCode(), output = {}
  // $: method, payload = {}, fields = getFields(method)
  // $: code_container, highlightCode()
  // $: network, highlightCode()
  // $: network, checkMethodAvailable(select)
</script>

<div class="container">
  <div class="grid">
    <div>
      <div class="toggle">
        <span class:active={network === "sandbox"}>Sandbox</span>
        <span class:active={network === "mainnet"}>Mainnet</span>
      </div>
  
      <label>
        <span>Choose a Link method</span>
        <select bind:value={method}>
          <option value="sell">sell</option>
          <option value="buy">buy</option>
        </select>
      </label>

      {#key method}
        <Fields {fields} bind:payload />
      {/key}
      
      <div>
        {JSON.stringify(payload, null, 4)}
      </div>
      
      <!-- {#each fields as field (method + field.key)}
      <div class="field">
        <label for={field.options.type === "checkbox" ? "" : null}>
          <span>{field.options.label || field.key}{field.options.optional ? " (optional)" : ""}</span>
          {#if field.key === "type"}
            <select on:change={(e)=>toggleType(e)}>
              {#each field.options.children as child}
                <option selected={field.options.selected === child} value={child}>{child}</option>
              {/each}
            </select>
          {:else}
            {#if field.options.type === "select" }
              <select bind:value={payload[field.key]}>
                {#each field.options.options as opts}
                  <option value={opts.value}>{opts.label}</option>
                {/each}
              </select>
            {:else if field.options.type == "checkbox"}
              {#each field.options.options as opts}
                <label style="display: block">
                  <input 
                    type="checkbox" 
                    on:change={({target: { checked }}) => modifyCheckbox(field.key, opts.value, checked)} 
                    value={opts.value}
                  >
                  {opts.label}
                </label>
              {/each}
            {:else}
              <Input bind:value={payload[field.key]} validator={field.options.validator} />
            {/if}
          {/if}
        </label>
      </div>
      {/each} -->
      
      <!-- {#if (methods[method].networks || [network]).includes(network)}
        <button class="submit" on:click={call}>Call method</button>
      {:else}
        <button disabled={true} class="submit">Method unavailable in {network}</button>
      {/if} -->
    </div>

    <!-- <div class="code">
      <button on:click={copyCode}>Copy to clipboard</button>
      <pre><code class="hljs" bind:this={code_container}></code></pre>
    </div> -->

    <!-- <div class="output">
      <div class="icon">
        {#if output.data}
          {#if output.status === "error"}
            <svg class="error" xmlns="http://www.w3.org/2000/svg" width="4.066" height="4.066" viewBox="0 0 4.066 4.066">
              <path id="Icon_material-error-outline" data-name="Icon material-error-outline" d="M4.83,5.643h.407v.407H4.83Zm0-1.626h.407v1.22H4.83ZM5.031,3A2.033,2.033,0,1,0,7.066,5.033,2.032,2.032,0,0,0,5.031,3Zm0,3.659A1.626,1.626,0,1,1,6.659,5.033,1.626,1.626,0,0,1,5.033,6.659Z" transform="translate(-3 -3)"/>
            </svg>
            <span>Error.</span>
          {:else}
            <svg class="success" xmlns="http://www.w3.org/2000/svg" width="4.166" height="4.166" viewBox="0 0 4.166 4.166">
              <g id="Icon_ionic-ios-checkmark-circle-outline" data-name="Icon ionic-ios-checkmark-circle-outline" transform="translate(-3.325 -3.325)">
                <path id="Path_1" data-name="Path 1" d="M12.528,12.395l-.172-.177a.037.037,0,0,0-.027-.012h0a.035.035,0,0,0-.027.012l-1.192,1.2-.434-.434a.038.038,0,0,0-.055,0l-.174.174a.039.039,0,0,0,0,.056l.547.547a.173.173,0,0,0,.114.056.181.181,0,0,0,.113-.054h0l1.307-1.314A.042.042,0,0,0,12.528,12.395Z" transform="translate(-6.078 -7.604)" stroke="currentColor" stroke-width="0.1"/>
                <path id="Path_2" data-name="Path 2" d="M5.408,3.649a1.759,1.759,0,1,1-1.244.515,1.748,1.748,0,0,1,1.244-.515m0-.274A2.033,2.033,0,1,0,7.441,5.408,2.033,2.033,0,0,0,5.408,3.375Z" transform="translate(0 0)" stroke="currentColor" stroke-width="0.1"/>
              </g>
            </svg>
            <span>Success!</span>
          {/if}
        {:else}
          <span>Output:</span>
        {/if}
      </div>
      <pre><code>{output.data && JSON.stringify(output.data || "", null, 4) || ""}</code></pre>
    </div> -->
  </div>

  <a href="https://docs.x.immutable.com/docs" target="_blank">
    <img class="logo" src="./logo.png" />
  </a>
</div>



<style>
  .logo {
    margin-top: 2rem;
    width: 240px;
    margin-left: calc(50% - 120px);
    filter: saturate(0);
    opacity: .65;
    transition: all .5s
  }

  .logo:hover {
    opacity: 1;
    filter: saturate(1)
  }

  .grid {
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0px 8px 40px rgba(0, 0, 0, .1);
    gap: .5rem;
  }

  @media screen and (max-width: 768px){
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .grid > div:first-child {
    padding: 1rem;
    grid-row: span 2;
  }

  .grid > div {
    border-radius: 8px;
    overflow: auto;
  }

  .toggle {
    background: #f0f0f0;
    display: inline-block;
    font-size: .75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    padding: .25rem;
    cursor: pointer;
    user-select: none;
  }

  .toggle span {
    padding: .25rem .5rem;
    display: inline-block;
    border-radius: 3px;
    transition: all .15s
  }

  .toggle span.active {
    background: #56585f;
    color: white;
  }

  pre {
    margin: 0
  }

  .code {
    position: relative;
    background: #282a36;
    padding: .75rem;
  }

  .code button {
    position: absolute;
    top: 10px;
    cursor: pointer;
    right: 10px;
    font-size: .75rem;
    background: #4d5269;
    padding: .25rem .5rem;
    border: none;
    color: white;
    opacity: .5;
    transition: opacity .2s
  }

  .code button:hover {
    opacity: 1
  }

  .code *, :global(code > *), .output * {
    font-family: monospace !important
  }

  .output {
    background: #f0f0f0;
    padding: .75rem;
  }

  label > span {
    display: block;
    font-size: .9rem;
    opacity: .6;
    margin-bottom: .35rem
  }

  .field {
    margin: .75rem 0
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

  .submit {
    margin-top: 1rem;
    padding: .75rem 1rem;
    font-size: .8rem;
    border-radius: 5px;
    background: var(--accent);
    border: none;
    color: white;
    transition: background-color .2s;
    cursor: pointer
  }

  .submit:hover {
    background-color: #29b8ce
  }

  .submit:disabled {
    background: grey;
    opacity: .75;
    cursor: not-allowed
  }
  
  .hljs {
    overflow: initial
  }
</style>