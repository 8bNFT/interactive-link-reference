<script>
    export let label, small, click, optional = false
</script>

<svelte:element this={click === false ? "div" : "label"} class="label" class:small>
    {#if label}
        <span>{label}{optional ? " (optional)" : ""}</span>
    {/if}
    <slot></slot>
</svelte:element>

<style>
    .label {
        display: block;
        margin-bottom: .65rem;
        cursor: default
    }

    span {
        display: block;
        font-size: .9rem;
        opacity: .6;
        margin-bottom: .35rem
    }

    .label.small {
        margin-bottom: .15rem
    }
</style>