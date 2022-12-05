<script>
    export let field_config, payload, parent

    import { get_payload } from "src/fields";
    import Fields from "./Fields.svelte";
    import InlineLabel from "./InlineLabel.svelte";
    import Label from "./Label.svelte";

    payload = get_payload(field_config)

    let current_fields = []

    const remove_field = index => current_fields = [...current_fields.slice(0, index), ...current_fields.slice(index + 1)]
    const add_field = config => current_fields = [...current_fields, {...config, payload: get_payload(config), visible: true}]
    const toggle_visibility = index => current_fields[index].visible = !current_fields[index].visible

    $: payload = current_fields.map(v => v.payload)
</script>

<Label click={false} label={field_config.label} optional={field_config.optional}>
    <div class="group">
        {#each current_fields as field, index (index)}
            <div class="child">
                <button class="toggle" class:hidden={field.visible} on:click={e => toggle_visibility(index)}>
                    {#if field.visible}
                        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"><path fill="currentColor" d="M10.94,6.08A6.93,6.93,0,0,1,12,6c3.18,0,6.17,2.29,7.91,6a15.23,15.23,0,0,1-.9,1.64,1,1,0,0,0-.16.55,1,1,0,0,0,1.86.5,15.77,15.77,0,0,0,1.21-2.3,1,1,0,0,0,0-.79C19.9,6.91,16.1,4,12,4a7.77,7.77,0,0,0-1.4.12,1,1,0,1,0,.34,2ZM3.71,2.29A1,1,0,0,0,2.29,3.71L5.39,6.8a14.62,14.62,0,0,0-3.31,4.8,1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20a9.26,9.26,0,0,0,5.05-1.54l3.24,3.25a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm6.36,9.19,2.45,2.45A1.81,1.81,0,0,1,12,14a2,2,0,0,1-2-2A1.81,1.81,0,0,1,10.07,11.48ZM12,18c-3.18,0-6.17-2.29-7.9-6A12.09,12.09,0,0,1,6.8,8.21L8.57,10A4,4,0,0,0,14,15.43L15.59,17A7.24,7.24,0,0,1,12,18Z"/></svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/></svg>
                    {/if}
                </button>
                <div>
                    {#if field.visible}
                        <Fields parent={{parent, payload}} bind:payload={current_fields[index].payload} field_config={field} />
                    {:else}
                        <InlineLabel click={false} small={true} label={`${field.label || "Field"} (hidden)`} />
                    {/if}
                </div>
                <button class="destructive" on:click={() => remove_field(index)}>Remove {field.label || ""}</button>
            </div>            
        {/each}
    </div>

    <div>
        {#if field_config.max && current_fields.length >= field_config.max}
            <button disabled={true}>Max fields</button>
        {:else}
            {#each Object.entries(field_config.fields || {}) as [field, config]}
                <button on:click={() => add_field(config)}>Add {config.label || field}</button>
            {/each}
        {/if}
        
    </div>
</Label>

<style>
    .group {
        padding-left: .15rem;
        margin-bottom: .5rem;
        position: relative;
    }

    .group::before {
        height: 100%;
        width: 2px;
        background: #f0f0f0;
        position: absolute;
        content: "";
        top: 0;
        left: 0
    }

    .child {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: .25rem .5rem;
        padding-top: .65rem;
        transition: background-color .25s;
        border-bottom: 2px solid #f7f7f7
    }

    .child:hover {
        background: #f7f7f7
    }

    .child button {
        flex-shrink: 0;
        opacity: 0;
        transition: background-color .15s, color .15s, opacity .2s
    }

    .child:hover button {
        opacity: 1
    }

    button {
        border: none;
        padding: .35rem .5rem;
        font-size: .8rem;
        border-radius: .2rem;
        cursor: pointer;
        background: #f0f0f0;
        color: #56585f;
        appearance: none;
        -webkit-appearance: none;
        transition: background-color .15s, color .15s
    }
    
    button:hover {
        background: #d4d4d4;
        color: black;
    }

    button + button {
        margin-left: .25rem;
    }

    button.destructive {
        margin-left: auto;
        background: rgba(194, 0, 0, 0);
        font-weight: 600;
        color: rgb(194, 0, 0);
    }

    button.destructive:hover {
        background: rgba(194, 0, 0, .06);
    }

    button.toggle {
        margin-right: .5rem;
        background: none;
        padding: 0;
    }

    button.toggle.hidden {
        align-self: flex-start;
    }

    button.toggle svg {
        height: 16px;
        width: 16px
    }

    button:disabled {
        background: #d4d4d4;
        color: rgb(65, 65, 65);
        opacity: .6;
        cursor: not-allowed
    }
</style>
