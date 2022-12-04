<script>
  /**
   * Planned changes
   * - allow for network specific options, fields
   * - introduce value parsers
   * - introduce field dependency (required if one of is selected)
  */

  import { get_fields, get_all_methods } from './fields'
  import Fields from './components/Fields.svelte';
  import Label from './components/Label.svelte';
  import CodeContainer from './components/CodeContainer.svelte';
  import { LinkCodeGenerator } from './link_code_generator';
  // import { tick } from 'svelte';

  const methods = get_all_methods()

  let network = "sandbox"
  let payload
  let method
  let fields
  let code
  let output = {}

  const Link = new LinkCodeGenerator(network)

  const execute_method = async () => {
    const { status, data } = await Link.execute()
    output = { status, data }
  }

  $: method ? fields = get_fields(method) : fields = {}
  $: Link.update_payload(method, payload)
  $: method, payload, network, code = Link.code()
</script>

<div class="container">
  <div class="grid">
    <div>
      <div on:click={() => network = Link.toggle_network()} class="toggle">
        <span class:active={network === "sandbox"}>Sandbox</span>
        <span class:active={network === "mainnet"}>Mainnet</span>
      </div>
  
      <Label label="Choose a Link method">
        <select bind:value={method}>
          {#each methods as [group, meths]}
            <optgroup label={group}>
              {#each Object.keys(meths) as method}
                <option value={method}>{method}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </Label>

      {#key method}
        <Fields field_config={fields} bind:payload />
      {/key}
      
      <button class="submit" on:click={execute_method}>Call method</button>
    </div>

    <CodeContainer {code} />

    <div class="output">
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
    </div>
  </div>

  <a href="https://docs.x.immutable.com/docs" target="_blank">
    <img class="logo" src="./logo.svg" />
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
    min-width: 100px
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

  .output * {
    font-family: monospace !important
  }

  .output {
    background: #f0f0f0;
    padding: .75rem;
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
</style>