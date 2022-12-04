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
  import Output from "./components/Output.svelte";
  import { LinkCodeGenerator } from './link_code_generator';
  import { DOCS_REFERENCES } from './docs';

  const methods = get_all_methods()

  let network = "sandbox"
  let payload, method, fields, code, output = {}

  const Link = new LinkCodeGenerator(network)

  const execute_method = async () => output = await Link.execute()

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
        {#if DOCS_REFERENCES[method]}
          <div class="docs">
            <a href={DOCS_REFERENCES[method]} target="_blank">See "{method}" documentation</a>
          </div>
        {/if}
      </Label>

      {#key method}
        <Fields field_config={fields} bind:payload />
      {/key}
      
      <button class="submit" on:click={execute_method}>Call method</button>
    </div>

    <CodeContainer {code} />

    <Output {output} />
  </div>

  <a href="https://docs.x.immutable.com/docs" target="_blank">
    <img class="logo" src="./logo.svg" />
  </a>
</div>



<style>
  .logo {
    margin-top: 2rem;
    width: 180px;
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

  .docs {
    margin-top: .15rem
  }

  .docs a, .docs a:visited {
    font-size: .75rem;
    color: #29b8ce
  }

  .docs a:hover {
    color: #1d7d8b
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